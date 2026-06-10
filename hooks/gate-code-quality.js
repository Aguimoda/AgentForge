#!/usr/bin/env node
/**
 * AgentForge — Gate: Calidad de código
 *
 * Se ejecuta como PreToolUse en Write|Edit sobre src/components/ y src/app/.
 * Bloquea (exit 2) si el contenido a escribir contiene:
 *   - Colores hex hardcodeados (#xxx, #xxxxxx) — usar tokens OKLCH
 *   - console.log olvidados
 *   - Emojis usados como iconos en JSX (en vez de SVG inline)
 *
 * No comprueba cosas que TypeScript ya detecta.
 */

const fs = require('fs');

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

  const filePath = (tool.file_path || tool.path || '').replace(/\\/g, '/');

  // Solo componentes y páginas — donde aplican las reglas de diseño
  const APPLIES_TO = ['/src/components/', '/src/app/'];
  if (!APPLIES_TO.some(p => filePath.includes(p))) {
    process.exit(0);
  }

  // Solo ficheros TypeScript/JSX
  if (!/\.(tsx?|jsx?)$/.test(filePath)) {
    process.exit(0);
  }

  // Obtener el contenido a escribir
  // Write: tool.content | Edit: tool.new_string
  const content = tool.content || tool.new_string || '';

  const violations = [];

  // ── Regla 1: Hex hardcodeado ─────────────────────────────────────────────
  // Busca #rgb o #rrggbb en cualquier posición (Tailwind arbitrary: bg-[#1a2b3c])
  // Excluye líneas de comentario (//) para no marcar falsos positivos en docs inline
  const contentNoComments = content.split('\n')
    .filter(l => !/^\s*\/\//.test(l))
    .join('\n');
  const hexMatches = contentNoComments.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g);
  if (hexMatches) {
    const unique = [...new Set(hexMatches)].slice(0, 5);
    violations.push({
      rule: 'HEX_COLOR',
      severity: '🔴 CRÍTICO',
      detail: `Colores hex hardcodeados: ${unique.join(', ')}`,
      fix: 'Usa tokens OKLCH de globals.css: bg-azul, text-verde, text-error, bg-surface-*, etc.',
    });
  }

  // ── Regla 2: console.log ─────────────────────────────────────────────────
  // Permitir console.log en comentarios (líneas con //)
  const lines = content.split('\n');
  const consoleLogs = lines
    .map((l, i) => ({ n: i + 1, l }))
    .filter(({ l }) => /console\.(log|error|warn|info)\s*\(/.test(l) && !/^\s*\/\//.test(l));

  if (consoleLogs.length > 0) {
    violations.push({
      rule: 'CONSOLE_LOG',
      severity: '🟡 IMPORTANTE',
      detail: `console.log en líneas: ${consoleLogs.map(c => c.n).join(', ')}`,
      fix: 'Elimina los console.log antes de hacer commit. Usa error boundaries o toast para errores visibles.',
    });
  }

  // ── Regla 3: Emojis como iconos UI ───────────────────────────────────────
  // Detecta emojis comunes usados como icono funcional en JSX
  // Solo en JSX text nodes (entre tags), no en strings de comentarios
  const emojiPattern = />\s*(📦|🚐|✅|📍|📱|🔔|⚠️|❌|✓|→|←|📋|🗓️|💬|⭐|🌟)\s*</g;
  const emojiMatches = content.match(emojiPattern);
  if (emojiMatches) {
    violations.push({
      rule: 'EMOJI_ICON',
      severity: '🟡 IMPORTANTE',
      detail: `Emojis usados como iconos UI: ${[...new Set(emojiMatches)].slice(0, 3).join(' ')}`,
      fix: 'Usa SVG inline con aria-hidden="true". Los emojis no son accesibles ni consistentes entre plataformas.',
    });
  }

  // ── Salida ───────────────────────────────────────────────────────────────
  if (violations.length === 0) {
    process.exit(0);
  }

  const hasCritical = violations.some(v => v.severity.includes('CRÍTICO'));

  const lines2 = [
    '',
    '╔══════════════════════════════════════════════════════════════╗',
    `║  ${hasCritical ? '🛑' : '⚠️ '} AgentForge — Violaciones de calidad detectadas      ║`,
    '╠══════════════════════════════════════════════════════════════╣',
    ...violations.map(v => [
      `║  ${v.severity} — ${v.rule.padEnd(45 - v.severity.length)}║`,
      `║  ${v.detail.slice(0, 60).padEnd(60)}║`,
      `║  Fix: ${v.fix.slice(0, 55).padEnd(55)}║`,
      '║                                                              ║',
    ]).flat(),
    '╚══════════════════════════════════════════════════════════════╝',
    '',
  ];

  // exit 2 → el mensaje debe ir a stderr para que Claude lo reciba
  process.stderr.write(lines2.join('\n'));

  // Solo bloquear si hay críticos (hex hardcodeado)
  // Los importantes (console.log, emojis) producen aviso pero no bloquean
  process.exit(hasCritical ? 2 : 0);
});
