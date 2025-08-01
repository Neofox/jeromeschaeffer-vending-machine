import { DispenseArea } from "./dispense-area"
import { ProductGrid } from "./product-grid"
import { StatusDisplay } from "./status-display"
import { UserWallet } from "./user-wallet"

export default function VendingMachine() {
  return (
    <div className="mx-auto flex h-screen max-w-6xl gap-6 py-8">
      <div className="w-2/3">
        <div className="h-full rounded-xl border-4 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-2xl flex flex-col gap-2">
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
