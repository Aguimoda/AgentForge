#!/usr/bin/env node
/**
 * AgentForge — Stop: Recordatorio de cierre de sesión
 *
 * Se ejecuta cuando Claude termina de responder.
 * Verifica el estado real del repositorio y, si hay cierre pendiente
 * (tarea activa o trabajo en src/ sin commitear), bloquea el stop UNA vez
 * (decision:"block") para que Claude complete el protocolo de cierre.
 *
 * El flag stop_hook_active del payload evita bucles: si ya bloqueamos
 * una vez en esta cadena, no volvemos a bloquear.
 */

const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

let raw = '';
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let payload = {};
  try { payload = JSON.parse(raw); } catch {}

  // Si ya bloqueamos una vez en esta cadena de stops → no insistir
  if (payload.stop_hook_active) {
    process.exit(0);
  }

  const checks = [];

  // ── ¿Hay cambios en src/ o specs/ sin commitear? ──────────────────────────
  const gitStatus = run('git status --porcelain -- src specs supabase');
  if (gitStatus) {
    const files = gitStatus.split('\n').filter(Boolean);
    checks.push(
      `${files.length} fichero(s) de código sin commitear (${files.slice(0, 3).map(f => f.trim()).join(', ')}${files.length > 3 ? ', …' : ''}). ` +
      'Protocolo: commit atómico con prefijo feat:/fix:/spec:/test: en la rama de trabajo.'
    );
  }

  // ── ¿current-task.json existe? (tarea en progreso) ───────────────────────
  if (fs.existsSync('.claude/current-task.json')) {
    let task = {};
    try { task = JSON.parse(fs.readFileSync('.claude/current-task.json', 'utf8')); } catch {}
    checks.push(
      `Tarea activa sin cerrar: ${task.us_id || '?'} (agente: ${task.current_agent || '?'}). ` +
      'Si la US está completa y aprobada por el Revisor → actualizar estado.md/plan.md y borrar current-task.json. ' +
      'Si no está completa → emitir el HANDOFF correspondiente.'
    );
  }

  // ── Salida ─────────────────────────────────────────────────────────────────
  if (checks.length === 0) {
    process.exit(0); // todo en orden, no molestar
  }

  // decision:"block" → Claude recibe `reason` y continúa para cerrar bien la sesión
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason:
      'AgentForge — protocolo de cierre pendiente:\n- ' +
      checks.join('\n- ') +
      '\nSi todo esto es intencionado (trabajo en curso que el humano va a continuar), puedes terminar tras explicarlo brevemente.',
  }));
  process.exit(0);
});
