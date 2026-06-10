#!/usr/bin/env node
/**
 * AgentForge — Gate: Tarea activa y .feature aprobado
 *
 * Se ejecuta como PreToolUse en Write|Edit.
 * Bloquea (exit 2) si se intenta escribir en src/ sin:
 *   1. .claude/current-task.json declarando la tarea activa
 *   2. El .feature que referencia existiendo en disco
 *
 * Excepciones: archivos de configuración, schemas, globals.css, etc.
 */

const fs = require('fs');
const path = require('path');

// ── Leer input del tool desde stdin ────────────────────────────────────────
let raw = '';
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0); // si no podemos parsear, dejamos pasar
  }

  // Claude Code envía { tool_name, tool_input: {...} } — el input real va en tool_input
  const tool = payload.tool_input || payload;

  const filePath = (tool.file_path || tool.path || '').replace(/\\/g, '/');

  // ── ¿Aplica este gate? ──────────────────────────────────────────────────
  // Solo ficheros dentro de src/
  if (!filePath.includes('/src/')) {
    process.exit(0);
  }

  // Excepciones: ficheros que no requieren spec
  const EXCEPTIONS = [
    'globals.css',
    'layout.tsx',
    'types.ts',
    'utils.ts',
    'config.',
    'schema',       // schemas de zod (lógica de validación, no UI)
    'middleware.ts',
    '.d.ts',
    'env.',
  ];
  if (EXCEPTIONS.some(e => filePath.includes(e))) {
    process.exit(0);
  }

  // ── Verificar current-task.json ─────────────────────────────────────────
  const TASK_FILE = '.claude/current-task.json';

  if (!fs.existsSync(TASK_FILE)) {
    const msg = [
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║  🛑  AgentForge GATE — ESCRITURA BLOQUEADA                  ║',
      '╠══════════════════════════════════════════════════════════════╣',
      '║  Motivo: no existe .claude/current-task.json                 ║',
      '║                                                              ║',
      '║  Antes de escribir código en src/ debes:                    ║',
      '║                                                              ║',
      '║  1. Clasificar la tarea (tabla en CLAUDE.md)                 ║',
      '║  2. Invocar al Spec Writer si no hay .feature                ║',
      '║  3. Crear .claude/current-task.json con:                    ║',
      '║     {                                                        ║',
      '║       "us_id": "US-XX",                                     ║',
      '║       "us_name": "Nombre de la US",                         ║',
      '║       "feature_path": "specs/features/.../US-XX-....feature"║',
      '║       "current_agent": "component-designer"                 ║',
      '║     }                                                        ║',
      '╚══════════════════════════════════════════════════════════════╝',
      '',
    ].join('\n');
    process.stderr.write(msg);
    process.exit(2);
  }

  // ── Verificar que el .feature existe ────────────────────────────────────
  let task;
  try {
    task = JSON.parse(fs.readFileSync(TASK_FILE, 'utf8'));
  } catch {
    process.stderr.write('\n🛑 AgentForge: .claude/current-task.json tiene JSON inválido. Corrígelo antes de continuar.\n\n');
    process.exit(2);
  }

  if (!task.feature_path) {
    process.stderr.write('\n🛑 AgentForge: current-task.json no tiene campo "feature_path". Añádelo apuntando al .feature de esta US.\n\n');
    process.exit(2);
  }

  const featurePath = task.feature_path.replace(/\\/g, '/');
  if (!fs.existsSync(featurePath)) {
    const msg = [
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║  🛑  AgentForge GATE — .feature NO ENCONTRADO               ║',
      '╠══════════════════════════════════════════════════════════════╣',
      `║  US activa : ${(task.us_id || '?').padEnd(47)}║`,
      `║  .feature  : ${featurePath.slice(-47).padEnd(47)}║`,
      '║                                                              ║',
      '║  El fichero .feature declarado en current-task.json          ║',
      '║  no existe en disco.                                         ║',
      '║                                                              ║',
      '║  → Invocar al Spec Writer para crearlo                       ║',
      '║  → O corregir la ruta en current-task.json                   ║',
      '╚══════════════════════════════════════════════════════════════╝',
      '',
    ].join('\n');
    process.stderr.write(msg);
    process.exit(2);
  }

  // Todo OK — permitir la escritura
  process.exit(0);
});
