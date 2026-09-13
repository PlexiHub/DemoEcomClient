import { Sparkles } from 'lucide-react';
import { ProductShowcaseManager } from '../settings/ProductShowcaseManager';

// Renders management view for miniature collection items and pocket-sized products
const MiniaturePage = () => {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          <span>Miniature Products</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Curate miniature sizes, decants, and trial packs featured in your store's miniature catalog.
        </p>
      </div>

      <ProductShowcaseManager
        showcaseKey="miniature"
        title="Miniature Collection"
        icon={Sparkles}
        iconColor="text-amber-500"
      />
    </div>
  );
};

export default MiniaturePage;
