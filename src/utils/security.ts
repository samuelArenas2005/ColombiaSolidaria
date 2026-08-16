/**
 * Security utility for input sanitization and login rate limiting (anti-DoS / brute force)
 */

// Basic HTML/Script injection sanitizer
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Simple in-memory rate limiter for login attempts (Brute force & DoS mitigation)
const LOGIN_ATTEMPT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

interface AttemptRecord {
  count: number;
  firstAttemptTimestamp: number;
  lockoutUntil?: number;
}

const loginAttemptsStore: { [key: string]: AttemptRecord } = {};

export function checkLoginRateLimit(identifier: string): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const key = identifier.toLowerCase().trim() || 'global_ip_guard';
  const record = loginAttemptsStore[key];

  if (!record) {
    return { allowed: true, remainingSeconds: 0 };
  }

  // Check if currently locked out
  if (record.lockoutUntil && now < record.lockoutUntil) {
    const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // Reset window if expired
  if (now - record.firstAttemptTimestamp > LOGIN_ATTEMPT_WINDOW_MS) {
    delete loginAttemptsStore[key];
    return { allowed: true, remainingSeconds: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    // Lock out for 2 minutes
    record.lockoutUntil = now + 120 * 1000;
    const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true, remainingSeconds: 0 };
}

export function recordFailedLoginAttempt(identifier: string): void {
  const now = Date.now();
  const key = identifier.toLowerCase().trim() || 'global_ip_guard';
  let record = loginAttemptsStore[key];

  if (!record || now - record.firstAttemptTimestamp > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttemptsStore[key] = {
      count: 1,
      firstAttemptTimestamp: now
    };
  } else {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockoutUntil = now + 120 * 1000; // 2 minutes lockout
    }
  }
}

export function clearLoginAttempts(identifier: string): void {
  const key = identifier.toLowerCase().trim() || 'global_ip_guard';
  delete loginAttemptsStore[key];
}
