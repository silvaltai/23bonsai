// supabase/functions/check-payment-status/index.ts
// Edge Function: Consulta el estado actual de la suscripción del usuario logueado
// Reemplaza el polling directo de /pago-exitoso a la tabla mp_events
// 23BONSAI - Lun 11 may 2026

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405)

  try {
    // ── 1. Validar autenticación ──
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return jsonResponse({ error: 'unauthorized' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supaUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supaUser.auth.getUser()
    if (authError || !user) return jsonResponse({ error: 'unauthorized' }, 401)

    // ── 2. Validar input (opcional: mp_subscription_id para verificación cruzada) ──
    let mpSubscriptionIdParam: string | null = null
    try {
      const body = await req.json()
      mpSubscriptionIdParam = body?.mp_subscription_id || null
    } catch {
      // No hay body, está bien
    }

    // ── 3. Leer profile del usuario llamante ──
    const supaAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { data: profile, error: profileError } = await supaAdmin
      .from('profiles')
      .select('plan, status, quota_total, quota_used, mp_subscription_id, plan_renews_at')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return jsonResponse({ error: 'profile_not_found' }, 404)
    }

    // ── 4. Verificación de seguridad: si frontend mandó mp_subscription_id, debe coincidir con el del profile ──
    if (mpSubscriptionIdParam && profile.mp_subscription_id && mpSubscriptionIdParam !== profile.mp_subscription_id) {
      // Intento de consultar suscripción ajena → rechazar
      return jsonResponse({ error: 'subscription_mismatch' }, 403)
    }

    // ── 5. Obtener el último evento de la suscripción (para contexto adicional) ──
    let lastEventStatus: string | null = null
    let lastEventAt: string | null = null

    if (profile.mp_subscription_id) {
      const { data: lastEvent } = await supaAdmin
        .from('subscription_events')
        .select('status, created_at')
        .eq('mp_subscription_id', profile.mp_subscription_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastEvent) {
        lastEventStatus = lastEvent.status
        lastEventAt = lastEvent.created_at
      }
    }

    // ── 6. Retornar estado ──
    return jsonResponse({
      success: true,
      plan: profile.plan,
      status: profile.status,
      quota_total: profile.quota_total,
      quota_used: profile.quota_used,
      mp_subscription_id: profile.mp_subscription_id,
      plan_renews_at: profile.plan_renews_at,
      last_event_status: lastEventStatus,
      last_event_at: lastEventAt
    })

  } catch (err) {
    console.error('Unhandled:', err)
    return jsonResponse({ error: 'internal_error' }, 500)
  }
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
