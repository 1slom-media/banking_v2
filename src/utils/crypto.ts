// src/utils/crypto.util.ts

import * as CryptoJS from 'crypto-js'; // ✅ E'tibor bering: default emas, `* as` ishlatilmoqda

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'default_key';

/**
 * Tokenni AES orqali shifrlaydi
 * @param token - Matnli token (access_token, refresh_token)
 * @returns Shifrlangan token (Base64 matn)
 */
export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_SECRET).toString();
}

/**
 * Shifrlangan tokenni AES orqali yechadi
 * @param ciphertext - Bazadan olingan shifrlangan token
 * @returns Asl token matni
 */
export function decryptToken(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
