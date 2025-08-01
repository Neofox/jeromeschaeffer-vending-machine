import { match } from "ts-pattern"
import { useStore } from "../store"
import { cn } from "../utils/cn"

// TODO: split this component into smaller components for better readability and maintainability
// TODO: use icon svg libraries for better icons
export default function VendingMachine() {
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)
  const { selectProduct, insertCash, payByCard, takeItemAndChange, resetFromError, cancelOrder } = useStore.getState()

  // TODO: memoize
  const getStatusMessage = () => {
    return match(status)
      .with({ name: "idle" }, () => "Please select a product")
      .with({ name: "awaiting-payment" }, ({ productId, insertedAmount }) => {
        const product = products.find((p) => p.id === productId)!
        const remaining = Math.max(0, product.price - insertedAmount)
        return `Selected: ${product.name} (${product.price}₩) | Inserted: ${insertedAmount}₩ | Remaining: ${remaining}₩`
      })
      .with({ name: "dispensing" }, ({ productId, change }) => {
        const product = products.find((p) => p.id === productId)!
        return `Dispensing ${product.name}${change > 0 ? ` | Change: ${change}₩` : ""}`
      })
      .with({ name: "error" }, ({ message }) => `Error: ${message}`)
      .exhaustive()
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <div className="w-2/3">
        <div className="rounded-xl border-4 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-2xl">
          <div className="mb-6 rounded-lg bg-black p-4">
            <div className="mb-4 grid grid-cols-3 gap-4">
              {products.slice(0, 3).map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product.id)}
                  disabled={product.stock <= 0 || status.name !== "idle"}
                  className={cn(
                    "relative flex h-32 flex-col items-center justify-center rounded-lg bg-white p-4 transition-all duration-200",
                    "cursor-pointer hover:scale-105 hover:shadow-lg",
                    {
                      ["scale-105"]: status.name === "awaiting-payment" && status.productId === product.id,
                      ["cursor-not-allowed opacity-75 hover:scale-100"]: product.stock <= 0 || status.name !== "idle",
                    },
                  )}
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl text-white">
                    {index === 0 ? "🥤" : index === 1 ? "💧" : "☕"}
                  </div>
                  <div className="text-xs font-bold text-gray-800">{product.name}</div>
                  <div className="text-xs font-semibold text-blue-600">{product.price}₩</div>
                  <div className="absolute top-1 right-1 text-xs text-gray-500">{product.stock}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex h-32 flex-col items-center justify-center rounded-lg bg-gray-300 p-4 opacity-50"
                >
                  <div className="mb-2 h-12 w-12 rounded-full bg-gray-400"></div>
                  <div className="text-xs font-bold text-gray-600">SOLD OUT</div>
                  <div className="text-xs text-red-500">0₩</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Message Display */}
          <div className="mb-6 rounded-lg bg-green-900 p-4 text-center font-mono text-green-100">
            <div className="text-sm">{getStatusMessage()}</div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 rounded-lg bg-gray-600 p-4">
              <div className="mb-2 text-center text-xs text-white">CHANGE</div>
              <div className="flex h-16 items-center justify-center rounded bg-black">
                {/* TODO:  */}
                {status.name === "dispensing" && status.change > 0 && (
                  <div className="font-bold text-green-400">{status.change}₩</div>
                )}
              </div>
            </div>

            <div className="flex-1 rounded-lg bg-gray-600 p-4">
              <div className="mb-2 text-center text-xs text-white">ITEM</div>
              <div className="flex h-16 items-center justify-center rounded bg-black">
                {status.name === "dispensing" && (
                  <button
                    onClick={takeItemAndChange}
                    className="animate-pulse rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    {/* TODO: calculate that outside of the tsx  */}
                    📦 TAKE {status.productId ? products.find((p) => p.id === status.productId)?.name : "ITEM"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Interface */}
      <div className="w-1/3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">💳 User Wallet</h2>

          {match(status)
            .with({ name: "idle" }, () => (
              <div className="text-center text-gray-500">
                <p>Select a product to continue</p>
              </div>
            ))
            .with({ name: "awaiting-payment" }, ({ productId }) => {
              const product = products.find((p) => p.id === productId)!

              // TODO: refacot the buttons
              return (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 text-sm text-gray-600">Selected Product:</div>
                    <div className="text-lg font-bold">{product.name}</div>
                    <div className="font-semibold text-blue-600">{product.price}₩</div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700">Insert Cash:</div>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => insertCash(100)}
                        className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
                      >
                        💵 100₩
                      </button>
                      <button
                        onClick={() => insertCash(500)}
                        className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
                      >
                        💵 500₩
                      </button>
                      <button
                        onClick={() => insertCash(1000)}
                        className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
                      >
                        💵 1,000₩
                      </button>
                      <button
                        onClick={() => insertCash(5000)}
                        className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
                      >
                        💵 5,000₩
                      </button>
                      <button
                        onClick={() => insertCash(10_000)}
                        className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-600"
                      >
                        💵 10,000₩
                      </button>
                    </div>
                  </div>

                  {/* TODO: show payment loading state */}
                  <div className="border-t pt-4">
                    <button
                      onClick={payByCard}
                      className="mb-3 w-full rounded-lg bg-blue-600 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-blue-700"
                    >
                      💳 Pay with Card
                    </button>

                    <button
                      onClick={cancelOrder}
                      className="w-full rounded-lg bg-red-500 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-600"
                    >
                      ❌ Cancel Order
                    </button>
                  </div>
                </div>
              )
            })
            .with({ name: "dispensing" }, () => (
              <div className="space-y-4 text-center">
                <div className="text-xl font-bold text-green-600">Payment Complete!</div>
                <p className="text-gray-600">Please collect your item and change from the vending machine.</p>
              </div>
            ))
            .with({ name: "error" }, ({ message }) => (
              <div className="space-y-4 text-center">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 font-semibold text-red-600">⚠️ Error</div>
                  <p className="text-sm text-red-700">{message}</p>
                </div>
                <button
                  onClick={resetFromError}
                  className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ))
            .exhaustive()}
        </div>
      </div>
    </div>
  )
}
