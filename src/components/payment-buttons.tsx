import { Banknote, CreditCard } from "lucide-react"
import { useStore } from "../store"

const cashAmounts = [
  { value: 100, label: "100₩" },
  { value: 500, label: "500₩" },
  { value: 1000, label: "1,000₩" },
  { value: 5000, label: "5,000₩" },
  { value: 10000, label: "10,000₩" },
]

export function CashButtons() {
  const insertCash = useStore((state) => state.insertCash)

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-700">Insert Cash:</div>
      <div className="flex flex-wrap gap-2">
        {cashAmounts.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => insertCash(value)}
            className="flex w-36 items-center justify-center gap-2 rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
          >
            <Banknote size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface PaymentButtonsProps {
  isProcessingPayment: boolean
  onPayByCard?: () => void
}

export function PaymentButtons({ isProcessingPayment = false, onPayByCard }: PaymentButtonsProps) {
  const status = useStore((state) => state.status)

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-700">Pay with Card</div>
      <button
        onClick={onPayByCard}
        disabled={isProcessingPayment || (status.name === "awaiting-payment" && status.insertedAmount > 0)}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCard size={20} />
        {isProcessingPayment ? "Processing..." : "Pay with Card"}
      </button>
    </div>
  )
}
