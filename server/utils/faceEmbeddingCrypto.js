import crypto from 'node:crypto';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';

function getKey() {
  const key = Buffer.from(
    process.env.FACE_EMBEDDING_ENCRYPTION_KEY || '',
    'base64'
  );

  if (key.length !== 32) {
    throw new Error(
      'FACE_EMBEDDING_ENCRYPTION_KEY must decode to 32 bytes.'
    );
  }

  return key;
}

export function encryptEmbedding(embedding) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    getKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(embedding), 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join('.');
}

export function decryptEmbedding(value) {
  if (typeof value !== 'string') {
    throw new Error('Encrypted face embedding is missing.');
  }

  const [ivPart, tagPart, encryptedPart] = value.split('.');

  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error('Stored face embedding is invalid.');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivPart, 'base64')
  );

  decipher.setAuthTag(Buffer.from(tagPart, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, 'base64')),
    decipher.final(),
  ]);

  const embedding = JSON.parse(decrypted.toString('utf8'));

  if (
    !Array.isArray(embedding) ||
    embedding.length === 0 ||
    !embedding.every(Number.isFinite)
  ) {
    throw new Error('Stored face embedding is invalid.');
  }

  return embedding;
}