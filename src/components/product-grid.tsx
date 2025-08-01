import { CircleQuestionMark, Coffee, CupSoda, GlassWater } from "lucide-react"
import { cn } from "../utils/cn"
import { useStore } from "../store"

const productIcons = {
  Cola: CupSoda,
  Water: GlassWater,
  Coffee: Coffee,
}

export function ProductGrid() {
  const status = useStore((state) => state.status)
  const products = useStore((state) => state.products)
  const selectProduct = useStore((state) => state.selectProduct)

  return (
    <div className="mb-6 rounded-lg bg-black p-4">
      <div className="mb-4 grid grid-cols-3 gap-4">
        {products.slice(0, 3).map((product) => {
          if (product.stock <= 0) {
            return <SoldOutPlaceholder key={product.id} />
          }

          const IconComponent = productIcons[product.name as keyof typeof productIcons] || CircleQuestionMark

          return (
            <button
              key={product.id}
              onClick={() => selectProduct(product.id)}
              disabled={status.name !== "idle"}
              className={cn(
                "relative flex h-32 flex-col items-center justify-center rounded-lg bg-white p-4 transition-all duration-200",
                "cursor-pointer hover:scale-105 hover:shadow-lg",
                {
                  ["scale-105 opacity-90"]: status.name === "awaiting-payment" && status.productId === product.id,
                  ["cursor-not-allowed opacity-75 hover:scale-100"]: status.name !== "idle",
                },
              )}
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <IconComponent size={24} />
              </div>
              <div className="text-xs font-bold text-gray-800">{product.name}</div>
              <div className="text-xs font-semibold text-blue-600">{product.price}₩</div>
              <div className="absolute top-1 right-1 text-xs text-gray-500">{product.stock}</div>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <SoldOutPlaceholder />
          </div>
        ))}
      </div>
    </div>
  )
}

function SoldOutPlaceholder() {
  return (
    <div className="flex h-32 flex-col items-center justify-center rounded-lg bg-gray-300 p-4 opacity-50">
      <div className="mb-2 h-12 w-12 rounded-full bg-gray-400"></div>
      <div className="text-xs font-bold text-gray-600">SOLD OUT</div>
      <div className="text-xs text-red-500">0₩</div>
    </div>
  )
}
