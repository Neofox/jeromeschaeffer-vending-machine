import { useState } from "react"
import { match, P } from "ts-pattern"
import { AlertTriangle, RefreshCw, Wallet, X } from "lucide-react"
import { CashButtons, PaymentButtons } from "./payment-buttons"
import { useStore } from "../store"

export function UserWallet() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)
  const payByCard = useStore((state) => state.payByCard)
  const resetFromError = useStore((state) => state.resetFromError)
  const cancelOrder = useStore((state) => state.cancelOrder)

  const handlePayByCard = async () => {
    setIsProcessingPayment(true)
    try {
      await payByCard()
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
      <h2 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold text-gray-800">
        <Wallet size={24} />
        User Wallet
      </h2>

      {match(status)
        .with({ name: "idle" }, () => (
          <div className="text-center text-gray-500">
            <p>Select a product to continue</p>
          </div>
        ))
        .with({ name: "awaiting-payment" }, ({ productId }) => {
          const product = products.find((p) => p.id === productId)!

          return (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm text-gray-600">
                  You've selected <span className="font-semibold text-gray-800">{product.name}</span> (
                  <span className="font-semibold text-blue-600">{product.price}₩</span>) please choose a payment method
                </div>
              </div>

              <CashButtons />
              <PaymentButtons onPayByCard={handlePayByCard} isProcessingPayment={isProcessingPayment} />
              <button
                onClick={cancelOrder}
                disabled={isProcessingPayment}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Cancel Order
              </button>
            </div>
          )
        })
        .with({ name: "dispensing", productId: P.not(null) }, () => (
          <div className="space-y-4 text-center">
            <div className="text-xl font-bold text-green-600">Payment Complete!</div>
            <p className="text-gray-600">Please collect your item and change from the vending machine.</p>
          </div>
        ))
        .with({ name: "dispensing", productId: P.nullish }, () => (
          <div className="space-y-4 text-center">
            <div className="text-xl font-bold text-green-600">Dispensing Change</div>
            <p className="text-gray-600">Please collect your change from the machine.</p>
          </div>
        ))
        .with({ name: "error" }, ({ message }) => (
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-2 flex items-center justify-center gap-2 font-semibold text-red-600">
                <AlertTriangle size={16} />
                Error
              </div>
              <p className="text-sm text-red-700">{message}</p>
            </div>
            <button
              onClick={resetFromError}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ))
        .exhaustive()}
    </div>
  )
}
