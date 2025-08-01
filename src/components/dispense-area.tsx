import { Package } from "lucide-react"
import { useStore } from "../store"
import { formatChange, getTotalFromChange } from "../utils/payment"

export function DispenseArea() {
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)
  const takeItem = useStore((state) => state.takeItem)
  const takeChange = useStore((state) => state.takeChange)

  const selectedProduct =
    status.name === "dispensing" && status.productId ? products.find((p) => p.id === status.productId) : null

  const hasChange = status.name === "dispensing" && status.change && status.change.length > 0
  const hasItem = status.name === "dispensing" && selectedProduct
  const changeTaken = status.name === "dispensing" && status.changeTaken
  const itemTaken = status.name === "dispensing" && status.itemTaken

  return (
    <div className="flex grow flex-col justify-end">
      <div className="flex justify-end gap-4">
        <div className="flex-1 rounded-lg bg-gray-600 p-4">
          <div className="mb-2 text-center text-xs text-white">CHANGE</div>
          <div className="flex h-24 items-center justify-center rounded bg-black">
            {hasChange && !changeTaken && (
              <div className="text-center">
                <button
                  onClick={takeChange}
                  className="flex animate-bounce cursor-pointer flex-col items-center rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                >
                  <div className="mb-1 font-bold">{getTotalFromChange(status.change)}₩</div>
                  <div className="max-w-60 text-xs leading-tight">{formatChange(status.change)}</div>
                </button>
              </div>
            )}
            {hasChange && changeTaken && (
              <div className="text-center text-gray-500">
                <div className="text-xs">CHANGE TAKEN</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 rounded-lg bg-gray-600 p-4">
          <div className="mb-2 text-center text-xs text-white">ITEM</div>
          <div className="flex h-24 items-center justify-center rounded bg-black">
            {hasItem && !itemTaken && (
              <button
                onClick={takeItem}
                className="flex animate-bounce cursor-pointer items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                <Package size={16} />
                TAKE {selectedProduct.name}
              </button>
            )}
            {hasItem && itemTaken && (
              <div className="text-center text-gray-500">
                <div className="text-xs">ITEM TAKEN</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
