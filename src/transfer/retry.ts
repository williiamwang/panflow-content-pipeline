export async function withRetry<T>(fn: () => Promise<T>, maxRetry = 2): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetry; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}
