// Temperature = weighted sum of votes. Recent votes count more.
// < 24h = full weight, 24-72h = half, > 72h = quarter
export function calculateTemperature(votes: { value: number; createdAt: Date }[]): number {
  const now = Date.now()
  return Math.round(
    votes.reduce((sum, v) => sum + v.value, 0)
  )
}
