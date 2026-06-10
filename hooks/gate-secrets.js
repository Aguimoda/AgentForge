#!/usr/bin/env node
/**
 * AgentForge — Gate: Secretos y credenciales
 *
 * Se ejecuta como PreToolUse en Write sobre CUALQUIER fichero.
 * Bloquea (exit 2) si el contenido contiene patrones de secretos:
 *   - API keys de servicios conocidos (Stripe, Twilio, Supabase service role, etc.)
 *   - Contraseñas hardcodeadas
 *   - JWT tokens completos
 *   - Claves privadas
 *
 * Excepciones: ficheros .example, .md de documentación, tests con datos falsos obvios.
 */

let raw = '';
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  // Claude Code envía { tool_name, tool_input: {...} } — el input real va en tool_input
  const tool = payload.tool_input || payload;

  // Solo aplica a Write (creación de fichero), no a Edit parcial
  // (Edit parcial edita strings específicos, riesgo menor)
  const filePath = (tool.file_path || tool.path || '').replace(/\\/g, '/');
  const content = tool.content || tool.new_string || '';

  if (!content) process.exit(0);

  // Excepciones: ficheros donde los secretos son esperados o de ejemplo
  const EXCEPTIONS = [
    '.example',
    '.env.example',
    'fixtures',
    'AUDIT-',
    '.md',         // documentación
    'SKILL.md',
    'README',
  ];
  if (EXCEPTIONS.some(e => filePath.includes(e))) {
    process.exit(0);
  }

  // ── Patrones de secretos ──────────────────────────────────────────────────
  const SECRET_PATTERNS = [
    // Stripe
    { pattern: /sk_live_[a-zA-Z0-9]{24,}/, name: 'Stripe Live Secret Key' },
    { pattern: /sk_test_[a-zA-Z0-9]{24,}/, name: 'Stripe Test Secret Key' },
    { pattern: /whsec_[a-zA-Z0-9]{24,}/, name: 'Stripe Webhook Secret' },

    // Twilio
    { pattern: /AC[a-f0-9]{32}/, name: 'Twilio Account SID' },
    { pattern: /SK[a-f0-9]{32}/, name: 'Twilio Auth Token pattern' },

    // Supabase service role (JWT que empieza por eyJ y es muy largo)
    // La anon key sb_publishable_ NO es un secreto — va en el cliente
    { pattern: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?eyJ[a-zA-Z0-9+/=]{200,}/, name: 'Supabase Service Role Key' },

    // Claves privadas genéricas
    { pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, name: 'Private Key (PEM)' },

    // JWT completo hardcodeado (eyJhbG... de más de 100 chars en una línea de código)
    // Excepto si está en una variable de entorno o test
    { pattern: /(?<![A-Z_=\s'"])eyJ[a-zA-Z0-9+/=]{100,}/, name: 'JWT hardcodeado' },

    // Contraseñas hardcodeadas obvias
    { pattern: /password\s*[:=]\s*["'][^"']{8,}["']/, name: 'Password hardcodeado' },
    { pattern: /secret\s*[:=]\s*["'][^"']{8,}["']/, name: 'Secret hardcodeado' },
  ];

  const found = [];
  for (const { pattern, name } of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      found.push(name);
    }
  }

  if (found.length === 0) {
    process.exit(0);
  }

  const msg = [
    '',
    '╔══════════════════════════════════════════════════════════════╗',
    '║  🚨  AgentForge GATE — SECRETO DETECTADO — CRÍTICO          ║',
    '╠══════════════════════════════════════════════════════════════╣',
    '║  Se han encontrado patrones de credenciales en el contenido  ║',
    '║  a escribir. Esta operación está BLOQUEADA.                  ║',
    '║                                                              ║',
    ...found.map(name => `║  ⛔ ${name.padEnd(56)}║`),
    '║                                                              ║',
    '║  Los secretos NUNCA van en el código fuente.                ║',
    '║  Usa variables de entorno:                                  ║',
    '║    Local  → .env.local (está en .gitignore)                 ║',
    '║    Vercel → Dashboard → Settings → Environment Variables    ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
  ].join('\n');

  process.stderr.write(msg);
  process.exit(2); // SIEMPRE bloquea — no hay excepción para secretos reales
});
