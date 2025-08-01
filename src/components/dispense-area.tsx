import { Package } from "lucide-react"
import { useStore } from "../store"
import { formatChange, getTotalFromChange } from "../utils/payment"

export function DispenseArea() {
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)
  const takeItemAndChange = useStore((state) => state.takeItemAndChange)

  const selectedProduct =
    status.name === "dispensing" && status.productId ? products.find((p) => p.id === status.productId) : null

  return (
    <div className="flex grow flex-col justify-end">
      <div className="flex justify-end gap-4">
        <div className="flex-1 rounded-lg bg-gray-600 p-4">
          <div className="mb-2 text-center text-xs text-white">CHANGE</div>
          <div className="flex h-16 items-center justify-center rounded bg-black">
            {status.name === "dispensing" && status.change.length > 0 && (
              <div className="text-center">
                <div className="mb-1 font-bold text-green-400">{getTotalFromChange(status.change)}₩</div>
                <div className="max-w-40 text-xs leading-tight text-green-300">{formatChange(status.change)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 rounded-lg bg-gray-600 p-4">
          <div className="mb-2 text-center text-xs text-white">ITEM</div>
          <div className="flex h-16 items-center justify-center rounded bg-black">
            {status.name === "dispensing" && selectedProduct && (
              <button
                onClick={takeItemAndChange}
                className="flex animate-pulse items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                <Package size={16} />
                TAKE {selectedProduct.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
