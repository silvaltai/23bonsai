// supabase/functions/webhook-mp-suscripciones/index.ts
// Edge Function: Recibe webhooks de Mercado Pago para suscripciones
// 23BONSAI - Dom 10 may 2026

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PLAN_QUOTA: Record<string, number> = {
  free: 1, starter: 5, growth: 15, scale: 30
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-signature, x-request-id, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405, headers: corsHeaders })

  try {
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')!
    const mpWebhookSecret = Deno.env.get('MP_WEBHOOK_SECRET')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!mpAccessToken || !mpWebhookSecret) {
      console.error('Variables de entorno faltantes')
      return new Response('server_misconfigured', { status: 500, headers: corsHeaders })
    }

    const supa = createClient(supabaseUrl, supabaseServiceKey)

    const rawBody = await req.text()
    let body: any
    try { body = JSON.parse(rawBody) } catch {
      return new Response('invalid_body', { status: 400, headers: corsHeaders })
    }

    const xSignature = req.headers.get('x-signature') ?? ''
    const xRequestId = req.headers.get('x-request-id') ?? ''

    const sigParts = Object.fromEntries(
      xSignature.split(',').map(p => p.trim().split('=').map(s => s.trim()))
    )
    const ts = sigParts['ts']
    const v1 = sigParts['v1']

    if (!ts || !v1) {
      return new Response('invalid_signature_format', { status: 401, headers: corsHeaders })
    }

    const url = new URL(req.url)
    const dataId = url.searchParams.get('data.id') ?? body?.data?.id ?? ''

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

    const encoder = new TextEncoder()
    const cryptoKey = await crypto.subtle.importKey(
      'raw', encoder.encode(mpWebhookSecret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(manifest))
    const computedSig = Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    if (computedSig !== v1) {
      console.error('Firma invalida.')
      await supa.from('subscription_events').insert({
        event_type: body.type || 'unknown',
        status: 'invalid_signature',
        raw_payload: { headers: { 'x-signature': xSignature, 'x-request-id': xRequestId }, body },
        signature_verified: false,
        processed: false
      })
      return new Response('invalid_signature', { status: 401, headers: corsHeaders })
    }

    const mpEventId = xRequestId || `${body.type}_${dataId}_${ts}`

    const { data: existing } = await supa
      .from('subscription_events')
      .select('id, processed')
      .eq('mp_event_id', mpEventId)
      .maybeSingle()

    if (existing?.processed) {
      return new Response('already_processed', { status: 200, headers: corsHeaders })
    }

    const eventType = body.type || body.action || 'unknown'

    if (eventType === 'subscription_preapproval' || eventType === 'preapproval') {
      await procesarPreapproval(supa, mpAccessToken, dataId, body, mpEventId)
    } else if (eventType === 'subscription_authorized_payment' || eventType === 'authorized_payment') {
      await procesarPayment(supa, mpAccessToken, dataId, body, mpEventId)
    } else {
      console.warn('Tipo desconocido:', eventType)
      await supa.from('subscription_events').insert({
        mp_event_id: mpEventId,
        event_type: eventType,
        status: 'unknown_type',
        raw_payload: body,
        signature_verified: true,
        processed: false
      })
    }

    return new Response('ok', { status: 200, headers: corsHeaders })

  } catch (err) {
    console.error('Unhandled:', err)
    return new Response('internal_error', { status: 500, headers: corsHeaders })
  }
})

async function procesarPreapproval(supa: any, token: string, id: string, body: any, mpEventId: string) {
  if (!id) return

  const r = await fetch(`https://api.mercadopago.com/preapproval/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!r.ok) {
    console.error('Error MP preapproval:', id)
    await supa.from('subscription_events').insert({
      mp_event_id: mpEventId, mp_subscription_id: id,
      event_type: 'subscription_preapproval', status: 'mp_fetch_error',
      raw_payload: body, signature_verified: true, processed: false
    })
    return
  }

  const sub = await r.json()
  const status: string = sub.status
  const externalRef: string = sub.external_reference ?? ''
  const refMatch = externalRef.match(/^user_([0-9a-f-]+)_(starter|growth|scale)_/)
  let userId = refMatch?.[1]
  let plan = refMatch?.[2]

  if (!userId) {
    const { data: p } = await supa.from('profiles')
      .select('id, plan').eq('mp_subscription_id', id).maybeSingle()
    if (p) { userId = p.id; plan = p.plan }
  }

  await supa.from('subscription_events').insert({
    mp_event_id: mpEventId, user_id: userId, mp_subscription_id: id,
    event_type: 'subscription_preapproval', status,
    raw_payload: sub, signature_verified: true, processed: true
  })

  if (!userId || !plan) return

  if (status === 'authorized') {
    const { data: cur } = await supa.from('profiles')
      .select('mp_subscription_id').eq('id', userId).single()

    if (cur?.mp_subscription_id && cur.mp_subscription_id !== id) {
      try {
        await fetch(`https://api.mercadopago.com/preapproval/${cur.mp_subscription_id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' })
        })
      } catch (e) { console.error('Error cancelando anterior:', e) }
    }

    const now = new Date()
    const renewsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    await supa.from('profiles').update({
      plan, status: 'active', mp_subscription_id: id,
      plan_started_at: now.toISOString(),
      plan_renews_at: renewsAt.toISOString(),
      plan_cancelled_at: null,
      quota_total: PLAN_QUOTA[plan] ?? 0,
      quota_used: 0
    }).eq('id', userId)

  } else if (status === 'cancelled' || status === 'paused') {
    await supa.from('profiles').update({
      plan_cancelled_at: new Date().toISOString()
    }).eq('id', userId).eq('mp_subscription_id', id)
  }
}

async function procesarPayment(supa: any, token: string, id: string, body: any, mpEventId: string) {
  if (!id) return

  const r = await fetch(`https://api.mercadopago.com/authorized_payments/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!r.ok) return

  const payment = await r.json()
  const preapprovalId = payment.preapproval_id

  const { data: profile } = await supa.from('profiles')
    .select('id, plan').eq('mp_subscription_id', preapprovalId).maybeSingle()

  await supa.from('subscription_events').insert({
    mp_event_id: mpEventId,
    user_id: profile?.id,
    mp_subscription_id: preapprovalId,
    event_type: 'authorized_payment',
    status: payment.status,
    raw_payload: payment,
    signature_verified: true,
    processed: true
  })

  if (!profile) return

  if (payment.status === 'approved') {
    const now = new Date()
    const renewsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    await supa.from('profiles').update({
      plan_renews_at: renewsAt.toISOString(),
      quota_used: 0,
      status: 'active'
    }).eq('id', profile.id)
  } else if (payment.status === 'rejected') {
    await supa.from('profiles').update({
      status: 'pending_payment'
    }).eq('id', profile.id)
  }
}
