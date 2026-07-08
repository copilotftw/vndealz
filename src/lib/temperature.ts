// Temperature = weighted sum of votes. Recent votes count more.
// < 24h = full weight, 24-72h = half, > 72h = quarter
export function calculateTemperature(votes: { value: number; createdAt: Date }[]): number {
  const now = Date.now()
  return Math.round(
    votes.reduce((sum, v) => {
      const ageHours = (now - v.createdAt.getTime()) / 3600000
      const weight = ageHours < 24 ? 1 : ageHours < 72 ? 0.5 : 0.25
      return sum + v.value * weight
    }, 0)
  )
}
