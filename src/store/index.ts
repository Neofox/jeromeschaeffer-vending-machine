import { match } from "ts-pattern"
import { create } from "zustand/react"
import { calculateChange, type Change } from "../utils/payment"

export type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export type MachineStatus =
  | { name: "idle" }
  | { name: "awaiting-payment"; productId: string; insertedAmount: number }
  | { name: "dispensing"; productId: string; change: Change }
  | { name: "error"; message: string; previousStatus: MachineStatus }

export type State = {
  status: MachineStatus
  products: Product[]
}

export type Actions = {
  selectProduct: (productId: string) => void
  insertCash: (amount: number) => void
  payByCard: () => Promise<void>
  takeItemAndChange: () => void
  resetFromError: () => void
  cancelOrder: () => void
}

const initialProducts: Product[] = [
  { id: "cola", name: "Cola", price: 1100, stock: 5 },
  { id: "water", name: "Water", price: 600, stock: 10 },
  { id: "coffee", name: "Coffee", price: 700, stock: 3 },
]

const initialState: State = {
  status: { name: "idle" },
  products: initialProducts,
}

export const useStore = create<State & Actions>((set, get) => ({
  ...initialState,

  selectProduct: (productId) => {
    const { status, products } = get()

    match(status)
      .with({ name: "idle" }, () => {
        const product = products.find((p) => p.id === productId)

        if (!product) {
          set({ status: { name: "error", message: "Invalid product selected.", previousStatus: status } })
          return
        }

        if (product.stock <= 0) {
          set({ status: { name: "error", message: `${product.name} is out of stock.`, previousStatus: status } })
          return
        }

        set({ status: { name: "awaiting-payment", productId, insertedAmount: 0 } })
      })
      .otherwise(() => {
        console.warn(`Action 'selectProduct' called in invalid state: ${status.name}`)
      })
  },

  insertCash: (amount) => {
    const { status, products } = get()

    match(status)
      .with({ name: "awaiting-payment" }, (currentStatus) => {
        const product = products.find((p) => p.id === currentStatus.productId)!
        const newAmount = currentStatus.insertedAmount + amount

        if (newAmount >= product.price) {
          // Payment complete
          const change = calculateChange(newAmount - product.price)
          const updatedProducts = products.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
          set({ products: updatedProducts, status: { name: "dispensing", productId: product.id, change } })
        } else {
          // More money needed
          set({ status: { ...currentStatus, insertedAmount: newAmount } })
        }
      })
      .otherwise(() => {
        console.warn(`Action 'insertCash' called in invalid state: ${status.name}`)
      })
  },

  payByCard: async () => {
    const { status, products } = get()

    await match(status)
      .with({ name: "awaiting-payment" }, async (currentStatus) => {
        const product = products.find((p) => p.id === currentStatus.productId)!
        console.log("Processing card payment...")
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate a 80% success rate for card payments because real life things happen
        if (Math.random() > 0.2) {
          console.log("Payment successful!")
          const updatedProducts = products.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
          set({
            products: updatedProducts,
            status: { name: "dispensing", productId: product.id, change: [] },
          })
        } else {
          console.error("Payment failed.")
          set({ status: { name: "error", message: "Card declined. Please try again.", previousStatus: status } })
        }
      })
      .otherwise(async () => {
        console.warn(`Action 'payByCard' called in invalid state: ${status.name}`)
      })
  },

  takeItemAndChange: () => {
    const { status } = get()
    match(status)
      .with({ name: "dispensing" }, () => set({ status: { name: "idle" } }))
      .otherwise(() => {
        console.warn(`Action 'takeItemAndChange' called in invalid state: ${status.name}`)
      })
  },

  resetFromError: () => {
    const { status } = get()
    match(status)
      .with({ name: "error" }, (errorStatus) => {
        // Return to the state the machine was in before the error
        set({ status: errorStatus.previousStatus })
      })
      .otherwise(() => {
        console.warn(`Action 'resetFromError' called in invalid state: ${status.name}`)
      })
  },

  cancelOrder: () => {
    const { status } = get()
    match(status)
      .with({ name: "awaiting-payment" }, () => {
        // Return any inserted money and go back to idle state
        set({ status: { name: "idle" } })
      })
      .otherwise(() => {
        console.warn(`Action 'cancelOrder' called in invalid state: ${status.name}`)
      })
  },
}))
