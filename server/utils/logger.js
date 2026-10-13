const REDACT = ['password', 'passwordHash', 'token', 'authorization', 'jwt'];
function redact(meta) {
  if (!meta || typeof meta !== 'object') return meta;
  const out = Array.isArray(meta) ? [...meta] : { ...meta };
  for (const k of Object.keys(out)) {
    if (REDACT.some((r) => k.toLowerCase().includes(r))) out[k] = '[REDACTED]';
    else if (typeof out[k] === 'object') out[k] = redact(out[k]);
  }
  return out;
}
function emit(level, message, meta) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, message, ...(meta ? { meta: redact(meta) } : {}) });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}
export const logger = {
  info: (m, meta) => emit('info', m, meta),
  warn: (m, meta) => emit('warn', m, meta),
  error: (m, meta) => emit('error', m, meta),
};
