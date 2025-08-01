export const money = [
  { value: 5000, type: "bill", name: "5,000₩ bill" },
  { value: 1000, type: "bill", name: "1,000₩ bill" },
  { value: 500, type: "coin", name: "500₩ coin" },
  { value: 100, type: "coin", name: "100₩ coin" },
] as const

export type Money = (typeof money)[number]

export type Change = {
  money: Money
  count: number
}[]

export function calculateChange(amount: number): Change {
  if (amount <= 0) return []

  const change: Change = []
  let remainingAmount = amount

  for (const m of money) {
    if (remainingAmount >= m.value) {
      const count = Math.floor(remainingAmount / m.value)
      if (count > 0) {
        change.push({ money: m, count })
        remainingAmount -= count * m.value
      }
    }
  }

  return change
}

export function formatChange(change: Change): string {
  if (change.length === 0) return "No change"

  return change
    .map(({ money, count }) => {
      const plural = count > 1 ? "s" : ""
      return `${count} × ${money.name}${plural}`
    })
    .join(", ")
}

export function getTotalFromChange(change: Change): number {
  return change.reduce((total, { money, count }) => {
    return total + money.value * count
  }, 0)
}

// TODO: add "inventory" check if we want to ensure we have enough money to make change
export function canMakeChange(amount: number): boolean {
  const change = calculateChange(amount)
  return change.length > 0 || amount === 0
}
