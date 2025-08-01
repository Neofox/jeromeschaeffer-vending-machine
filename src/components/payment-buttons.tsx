import { Banknote, CreditCard } from "lucide-react"
import { useStore } from "../store"
import { money } from "../utils/payment"

export function CashButtons() {
  const insertCash = useStore((state) => state.insertCash)

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-700">Insert Cash:</div>
      <div className="flex flex-wrap gap-2">
        {money.map((m) => (
          <button
            key={m.value}
            onClick={() => insertCash(m)}
            className="flex w-36 items-center justify-center gap-2 rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
          >
            <Banknote size={16} />
            {m.name}
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
