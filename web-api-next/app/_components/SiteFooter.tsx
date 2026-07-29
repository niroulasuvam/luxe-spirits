import { Icon } from "./Icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ece7dc] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 text-sm text-neutral-600 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="mb-4 text-lg font-bold text-[#765d08]">Liquor Hub</h2>
          <p className="max-w-xs leading-6">The destination for the world&apos;s most exclusive spirits. Direct from independent distilleries to your private cellar.</p>
          <div className="mt-5 flex gap-3 text-[#765d08]">
            <Icon name="shield" className="h-4 w-4" />
            <Icon name="arrow" className="h-4 w-4" />
            <Icon name="mail" className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-neutral-950">Explore</h3>
          <ul className="space-y-3">
            <li>Vintage Collections</li>
            <li>New Arrivals</li>
            <li>Tasting Events</li>
            <li>Wholesale</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-neutral-950">Support</h3>
          <ul className="space-y-3">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Shipping Info</li>
            <li>Track Order</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
