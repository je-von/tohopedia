export const convertPointsToBadge = (points: number) => {
  if (points <= 50) return 'bronze'
  else if (points <= 100) return 'silver'
  else if (points <= 150) return 'gold'
  else return 'diamond'
}
