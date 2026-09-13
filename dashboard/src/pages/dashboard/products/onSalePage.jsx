import { Tag } from 'lucide-react';
import { ProductShowcaseManager } from '../settings/ProductShowcaseManager';

// Renders management view for products actively listed on sale
const OnSalePage = () => {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Tag className="h-6 w-6 text-rose-500" />
          <span>On Sale Products</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Curate and manage discount collections and promotional products highlighted on your storefront.
        </p>
      </div>

      <ProductShowcaseManager
        showcaseKey="onSale"
        title="On Sale Products"
        icon={Tag}
        iconColor="text-rose-500"
      />
    </div>
  );
};

export default OnSalePage;
