import { useMemo } from "react"
import { useStore } from "../store"
import { getTotalFromChange } from "../utils/payment"
import { match } from "ts-pattern"

export function StatusDisplay() {
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)

  const statusMessage = useMemo(() => {
    return match(status)
      .with({ name: "idle" }, () => "Please select a product")
      .with({ name: "awaiting-payment" }, ({ productId, insertedAmount }) => {
        const product = products.find((p) => p.id === productId)
        if (!product) return "Product not found"
        const remaining = Math.max(0, product.price - insertedAmount)

        return `Selected: ${product.name} (${product.price}₩) | Inserted: ${insertedAmount}₩ | Remaining: ${remaining}₩`
      })
      .with({ name: "dispensing" }, ({ productId, change }) => {
        const product = products.find((p) => p.id === productId)
        const totalChange = getTotalFromChange(change)
        let message = "Finishing transaction... "
        if (totalChange > 0) message += `Change: ${totalChange}₩`
        if (product) message += ` Dispensing ${product.name} `

        return message
      })
      .with({ name: "error" }, ({ message }) => `Error: ${message}`)
      .otherwise(() => "Unknown status")
  }, [status, products])

  return (
    <div className="mb-6 rounded-lg bg-green-900 p-4 text-center font-mono text-green-100">
      <div className="text-sm">{statusMessage}</div>
    </div>
  )
}
