import { test, expect } from "bun:test"
import { calculateChange, formatChange, getTotalFromChange, money } from "./payment"

test("return empty array for zero amount", () => {
  const result = calculateChange(0)
  expect(result).toEqual([])
})

test("return empty array for negative amount", () => {
  const result = calculateChange(-100)
  expect(result).toEqual([])
})

test("return 'No change' for empty array", () => {
  const result = formatChange([])
  expect(result).toBe("No change")
})

test("return 0 for empty array", () => {
  const result = getTotalFromChange([])
  expect(result).toBe(0)
})

test("handle single 5000₩ bill", () => {
  const result = calculateChange(5000)
  expect(result).toEqual([{ money: money[0], count: 1 }])
})

test("handle single 100₩ coin", () => {
  const result = calculateChange(100)
  expect(result).toEqual([{ money: money[3], count: 1 }])
})

test("handle multiple money", () => {
  const result = calculateChange(1600) // 1000 + 500 + 100
  expect(result).toEqual([
    { money: money[1], count: 1 }, // 1000₩ bill
    { money: money[2], count: 1 }, // 500₩ coin
    { money: money[3], count: 1 }, // 100₩ coin
  ])
})

test("prefer larger denominations", () => {
  const result = calculateChange(6000) // Should be 5000 + 1000, not 6×1000
  expect(result).toEqual([
    { money: money[0], count: 1 }, // 5000₩ bill
    { money: money[1], count: 1 }, // 1000₩ bill
  ])
})

test("handle amounts that don't divide evenly", () => {
  const result = calculateChange(1357) // 1000 + 300 + 57₩ lost
  expect(result).toEqual([
    { money: money[1], count: 1 }, // 1000₩ bill
    { money: money[3], count: 3 }, // 100₩ coins (3x)
  ])
  expect(getTotalFromChange(result)).toBe(1300) // 57₩ is lost
})

test("format single change correctly", () => {
  const change = [{ money: money[1], count: 1 }]
  const result = formatChange(change)
  expect(result).toBe("1 × 1,000₩ bill")
})

test("format multiple changes correctly", () => {
  const change = [
    { money: money[1], count: 1 },
    { money: money[2], count: 1 },
    { money: money[3], count: 2 },
  ]
  const result = formatChange(change)
  expect(result).toBe("1 × 1,000₩ bill, 1 × 500₩ coin, 2 × 100₩ coins")
})

test("handle plurals correctly", () => {
  const change = [
    { money: money[0], count: 2 },
    { money: money[3], count: 3 },
  ]
  const result = formatChange(change)
  expect(result).toBe("2 × 5,000₩ bills, 3 × 100₩ coins")
})

test("calculate total correctly", () => {
  const change = [
    { money: money[1], count: 1 }, // 1000₩
    { money: money[2], count: 1 }, // 500₩
    { money: money[3], count: 2 }, // 200₩
  ]
  const result = getTotalFromChange(change)
  expect(result).toBe(1700)
})
