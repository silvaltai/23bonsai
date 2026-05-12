// supabase/functions/crear-suscripcion/index.ts
// Edge Function: Crea suscripción recurrente en Mercado Pago
// 23BONSAI - Dom 10 may 2026

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ─── Configuración de planes ───
const PLAN_CONFIG: Record<string, { amount: number; reason: string; quota: number }> = {
  starter: { amount: 97000,  reason: '23BONSAI Plan Starter', quota: 5 },
  growth:  { amount: 150000, reason: '23BONSAI Plan Growth',  quota: 15 },
  scale:   { amount: 300000, reason: '23BONSAI Plan Scale',   quota: 30 }
}

const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://23bonsai.vercel.app'

// ─── CORS headers ───
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405)
  }

  try {
    // ─── 1. Validar autenticación ───
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'unauthorized' }, 401)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')!

    if (!mpAccessToken) {
      console.error('MP_ACCESS_TOKEN no configurado')
      return jsonResponse({ error: 'server_misconfigured' }, 500)
    }

    // Cliente con JWT del usuario para validar identidad
    const supaUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supaUser.auth.getUser()
    if (authError || !user) {
      return jsonResponse({ error: 'unauthorized' }, 401)
    }

    // ─── 2. Validar input ───
    let body: { plan?: string }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: 'invalid_body' }, 400)
    }

    const plan = body.plan
    if (!plan || !PLAN_CONFIG[plan]) {
      return jsonResponse({ error: 'invalid_plan' }, 400)
    }

    const planConfig = PLAN_CONFIG[plan]

    // ─── 3. Cliente con service_role para escribir profile ───
    const supaAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // ─── 4. Verificar que el usuario no tenga suscripción activa ya ───
    const { data: profile, error: profileError } = await supaAdmin
      .from('profiles')
      .select('plan, status, mp_subscription_id, plan_renews_at')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('Error leyendo profile:', profileError)
      return jsonResponse({ error: 'profile_not_found' }, 404)
    }

    // Si ya tiene una suscripción del MISMO plan activa, no permitir duplicar
    if (
      profile.mp_subscription_id &&
      profile.plan === plan &&
      profile.status === 'active' &&
      profile.plan_renews_at &&
      new Date(profile.plan_renews_at) > new Date()
    ) {
      return jsonResponse({ error: 'already_subscribed', message: 'Ya tienes este plan activo.' }, 409)
    }

    // ─── 5. Crear suscripción en MP ───
    const externalReference = `user_${user.id}_${plan}_${Date.now()}`

    const mpPayload = {
      reason: planConfig.reason,
      external_reference: externalReference,
      payer_email: user.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: planConfig.amount,
        currency_id: 'CLP'
      },
      back_url: `${SITE_URL}/pago-exitoso?plan=${plan}`,
      status: 'pending'
    }

    const mpResponse = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mpPayload)
    })

    const mpData = await mpResponse.json()

    if (!mpResponse.ok) {
      console.error('Error MP API:', mpData)
      return jsonResponse({
        error: 'mp_error',
        message: mpData.message || 'No pudimos crear la suscripción.',
        mp_error: mpData
      }, 500)
    }

    if (!mpData.id || !mpData.init_point) {
      console.error('Respuesta MP inesperada:', mpData)
      return jsonResponse({ error: 'mp_invalid_response' }, 500)
    }

    // ─── 6. Guardar mp_subscription_id en profile (status pendiente) ───
    // Usamos un status temporal "pending_subscription" hasta que el webhook confirme
    const { error: updateError } = await supaAdmin
      .from('profiles')
      .update({
        mp_subscription_id: mpData.id,
        status: 'pending_payment',
        plan: plan
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error actualizando profile:', updateError)
      // La suscripción se creó en MP pero no pudimos guardarla. El webhook eventualmente la procesa.
    }

    // ─── 7. Auditar evento de creación ───
    await supaAdmin
      .from('subscription_events')
      .insert({
        user_id: user.id,
        mp_subscription_id: mpData.id,
        event_type: 'subscription.created',
        status: 'pending',
        raw_payload: mpData,
        signature_verified: true,
        processed: true
      })

    // ─── 8. Retornar URL de checkout ───
    return jsonResponse({
      success: true,
      subscription_id: mpData.id,
      checkout_url: mpData.init_point
    })

  } catch (err) {
    console.error('Unhandled error:', err)
    return jsonResponse({ error: 'internal_error' }, 500)
  }
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
