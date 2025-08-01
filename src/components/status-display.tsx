import { useMemo } from "react"
import { useStore } from "../store"
import { getTotalFromChange } from "../utils/payment"

export function StatusDisplay() {
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)

  const statusMessage = useMemo(() => {
    switch (status.name) {
      case "idle":
        return "Please select a product"

      case "awaiting-payment": {
        const product = products.find((p) => p.id === status.productId)!
        const remaining = Math.max(0, product.price - status.insertedAmount)
        return `Selected: ${product.name} (${product.price}₩) | Inserted: ${status.insertedAmount}₩ | Remaining: ${remaining}₩`
      }

      case "dispensing": {
        const product = products.find((p) => p.id === status.productId)!
        const totalChange = getTotalFromChange(status.change)
        return `Dispensing ${product.name}${totalChange > 0 ? ` | Change: ${totalChange}₩` : ""}`
      }

      case "error":
        return `Error: ${status.message}`

      default:
        return ""
    }
  }, [status, products])

  return (
    <div className="mb-6 rounded-lg bg-green-900 p-4 text-center font-mono text-green-100">
      <div className="text-sm">{statusMessage}</div>
    </div>
  )
}
