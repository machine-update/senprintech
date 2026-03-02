type ResetEntry = {
  userId: string;
  expiresAt: number;
  used: boolean;
};

const resetStore = new Map<string, ResetEntry>();

function cleanupExpired() {
  const now = Date.now();
  for (const [token, value] of resetStore.entries()) {
    if (value.expiresAt <= now || value.used) {
      resetStore.delete(token);
    }
  }
}

export function saveResetToken(token: string, userId: string, ttlMs: number) {
  cleanupExpired();
  resetStore.set(token, { userId, expiresAt: Date.now() + ttlMs, used: false });
}

export function consumeResetToken(token: string) {
  cleanupExpired();
  const record = resetStore.get(token);

  if (!record || record.used || record.expiresAt <= Date.now()) {
    return null;
  }

  record.used = true;
  resetStore.set(token, record);
  return { userId: record.userId };
}
