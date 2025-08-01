import { DispenseArea } from "./dispense-area"
import { ProductGrid } from "./product-grid"
import { StatusDisplay } from "./status-display"
import { UserWallet } from "./user-wallet"

export default function VendingMachine() {
  return (
    <div className="mx-auto flex h-screen max-w-6xl gap-6 py-8">
      <div className="w-2/3">
        <div className="flex h-full flex-col gap-2 rounded-xl border-4 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 p-6 px-12 shadow-2xl">
          <ProductGrid />
          <StatusDisplay />
          <DispenseArea />
        </div>
      </div>

      <div className="w-1/3">
        <UserWallet />
      </div>
    </div>
  )
}
