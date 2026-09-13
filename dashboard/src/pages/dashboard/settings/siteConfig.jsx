import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Palette,
  Globe,
  Image as ImageIcon,
  Sliders,
  Save,
  RefreshCw,
  Sparkles,
  Check,
  Eye,
  Mail,
  Phone,
  Layers,
  Flag,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

const COLOR_PRESETS = [
  {
    name: 'Plexivia Cyber Cyan (Default)',
    primaryColor: '#58C1C3',
    secondaryColor: '#97CC6F',
    accentColor: '#284A52',
    darkBgColor: '#0C1618',
    surfaceColor: '#122225',
    cardColor: '#15272B',
    borderColor: '#1E373D',
    textColor: '#F5F7F7',
    mutedColor: '#94AFB5',
  },
  {
    name: 'Emerald Luxe',
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    accentColor: '#065F46',
    darkBgColor: '#06281E',
    surfaceColor: '#0D382B',
    cardColor: '#134737',
    borderColor: '#1A5C47',
    textColor: '#ECFDF5',
    mutedColor: '#6EE7B7',
  },
  {
    name: 'Royal Purple & Gold',
    primaryColor: '#A855F7',
    secondaryColor: '#F59E0B',
    accentColor: '#581C87',
    darkBgColor: '#130A24',
    surfaceColor: '#1E1038',
    cardColor: '#28174A',
    borderColor: '#3B236E',
    textColor: '#FAF5FF',
    mutedColor: '#C084FC',
  },
  {
    name: 'Oceanic Sapphire',
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    accentColor: '#075985',
    darkBgColor: '#0B192C',
    surfaceColor: '#11233D',
    cardColor: '#172E4F',
    borderColor: '#1E3E66',
    textColor: '#F0F9FF',
    mutedColor: '#7DD3FC',
  },
  {
    name: 'Crimson Velvet',
    primaryColor: '#E11D48',
    secondaryColor: '#FB7185',
    accentColor: '#881337',
    darkBgColor: '#1F0A10',
    surfaceColor: '#2E0E18',
    cardColor: '#3D1320',
    borderColor: '#521A2C',
    textColor: '#FFF1F2',
    mutedColor: '#FDA4AF',
  },
];

// Manages site configuration, theme colors, branding assets, and promotional banners
const SiteConfigPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  const [general, setGeneral] = useState({
    siteName: 'PLEXIVIA',
    tagline: 'Crafting Digital Dreams',
    notificationEmail: 'support@plexivia.com',
    contactEmail: 'info@plexivia.com',
    phone: '+880 1700-000000',
    whatsappNumber: '8801700000000',
    currencySymbol: '৳ ',
  });

  const [themeColors, setThemeColors] = useState({
    primaryColor: '#58C1C3',
    secondaryColor: '#97CC6F',
    accentColor: '#284A52',
    darkBgColor: '#0C1618',
    surfaceColor: '#122225',
    cardColor: '#15272B',
    borderColor: '#1E373D',
    textColor: '#F5F7F7',
    mutedColor: '#94AFB5',
  });

  const [branding, setBranding] = useState({
    logoUrl: '',
    darkLogoUrl: '',
    faviconUrl: '',
    showTagline: true,
  });

  const [banners, setBanners] = useState({
    heroBanners: [
      {
        title: 'Next-Gen Digital Commerce',
        subtitle: 'Minimalist, performance-first shopping experience built for modern scale.',
        badge: 'Plexivia 2.0 Released',
        imageUrl: '',
        ctaText: 'Explore Collection',
        ctaLink: 'shop',
        secondaryCtaText: 'Book a Demo',
      },
    ],
    aboutBanner: {
      title: 'PLEXIVIA – Crafting Digital Dreams',
      subtitle: 'Digital Development Agency',
      description: 'We build bespoke web applications, modern e-commerce systems, and high-performance digital platforms that help brands grow and leave lasting impressions.',
      imageUrl: '',
    },
    promoBanner: {
      enabled: true,
      badge: '⚡ Special Launch Offer',
      text: 'Get Free Nationwide Delivery on All Orders Over ৳ 2,000',
      link: 'shop',
    },
  });

  const { data: configData, isLoading } = useQuery({
    queryKey: ['site-config-settings'],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/settings/site-config');
      return res.data?.data || {};
    },
  });

  useEffect(() => {
    if (configData) {
      if (configData.general) setGeneral((prev) => ({ ...prev, ...configData.general }));
      if (configData.themeColors) setThemeColors((prev) => ({ ...prev, ...configData.themeColors }));
      if (configData.branding) setBranding((prev) => ({ ...prev, ...configData.branding }));
      if (configData.banners) {
        setBanners((prev) => ({
          heroBanners: configData.banners.heroBanners?.length ? configData.banners.heroBanners : prev.heroBanners,
          aboutBanner: { ...prev.aboutBanner, ...configData.banners.aboutBanner },
          promoBanner: { ...prev.promoBanner, ...configData.banners.promoBanner },
        }));
      }
    }
  }, [configData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        general,
        themeColors,
        branding,
        banners,
      };
      const res = await apiClient.put('/api/v1/settings/site-config', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Site configuration saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['site-config-settings'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save site configuration');
    },
  });

  const applyPreset = (preset) => {
    setThemeColors({
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      darkBgColor: preset.darkBgColor,
      surfaceColor: preset.surfaceColor,
      cardColor: preset.cardColor,
      borderColor: preset.borderColor,
      textColor: preset.textColor,
      mutedColor: preset.mutedColor,
    });
    toast.info(`Theme palette updated to ${preset.name}. Click Save to apply.`);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Site Config</h1>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Storefront & Branding
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure website identity, theme colors, logos, and promotional banners for your store.
          </p>
        </div>

        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || isLoading}
          className="gap-2 shadow-sm min-w-[140px]"
        >
          {saveMutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'general'
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>General Info</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'theme'
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Theme Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'branding'
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Branding & Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'banners'
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Banners & Promo</span>
        </button>
      </div>

      {/* TAB 1: GENERAL INFO */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>Website Identity</span>
              </CardTitle>
              <CardDescription>Basic store information and titles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Website / Brand Name
                </label>
                <Input
                  value={general.siteName}
                  onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                  placeholder="e.g., PLEXIVIA"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Tagline / Slogan
                </label>
                <Input
                  value={general.tagline}
                  onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                  placeholder="e.g., Crafting Digital Dreams"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Currency Symbol
                </label>
                <Input
                  value={general.currencySymbol}
                  onChange={(e) => setGeneral({ ...general, currencySymbol: e.target.value })}
                  placeholder="e.g., ৳ or $"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Contact & Notifications</span>
              </CardTitle>
              <CardDescription>Emails and numbers for notifications and support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Order Notification Email (কোন ইমেইলে ইমেইল যাবে)
                </label>
                <Input
                  type="email"
                  value={general.notificationEmail}
                  onChange={(e) => setGeneral({ ...general, notificationEmail: e.target.value })}
                  placeholder="orders@yourstore.com"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  New orders and alerts will be dispatched to this mailbox.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Public Contact / Support Email
                </label>
                <Input
                  type="email"
                  value={general.contactEmail}
                  onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                  placeholder="support@yourstore.com"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  WhatsApp Number (with country code)
                </label>
                <Input
                  value={general.whatsappNumber}
                  onChange={(e) => setGeneral({ ...general, whatsappNumber: e.target.value })}
                  placeholder="8801700000000"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: THEME COLORS */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          {/* Preset Palettes */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>One-Click Preset Themes</span>
              </CardTitle>
              <CardDescription>Choose a professionally curated theme palette or customize below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/60 bg-card/60 hover:bg-card transition-all text-left group"
                  >
                    <div>
                      <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {preset.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.primaryColor }} />
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.secondaryColor }} />
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.darkBgColor }} />
                        <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.surfaceColor }} />
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Apply</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Color Pickers & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/60 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span>Custom Color Palette</span>
                </CardTitle>
                <CardDescription>Adjust hex color values to match your exact brand identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Primary Brand Color (Buttons & Highlights)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColors.primaryColor}
                        onChange={(e) => setThemeColors({ ...themeColors, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={themeColors.primaryColor}
                        onChange={(e) => setThemeColors({ ...themeColors, primaryColor: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Secondary Accent Color (Badges & Secondary CTAs)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColors.secondaryColor}
                        onChange={(e) => setThemeColors({ ...themeColors, secondaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={themeColors.secondaryColor}
                        onChange={(e) => setThemeColors({ ...themeColors, secondaryColor: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Dark Background Canvas
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColors.darkBgColor}
                        onChange={(e) => setThemeColors({ ...themeColors, darkBgColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={themeColors.darkBgColor}
                        onChange={(e) => setThemeColors({ ...themeColors, darkBgColor: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Surface & Header Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColors.surfaceColor}
                        onChange={(e) => setThemeColors({ ...themeColors, surfaceColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={themeColors.surfaceColor}
                        onChange={(e) => setThemeColors({ ...themeColors, surfaceColor: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Product Card Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColors.cardColor}
                        onChange={(e) => setThemeColors({ ...themeColors, cardColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={themeColors.cardColor}
                        onChange={(e) => setThemeColors({ ...themeColors, cardColor: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Border & Divider Line
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColors.borderColor}
                        onChange={(e) => setThemeColors({ ...themeColors, borderColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={themeColors.borderColor}
                        onChange={(e) => setThemeColors({ ...themeColors, borderColor: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Storefront Preview Card */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>Live Preview</span>
                </CardTitle>
                <CardDescription>Instant preview with your selected colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="rounded-xl p-5 space-y-4 border transition-all"
                  style={{
                    backgroundColor: themeColors.darkBgColor,
                    borderColor: themeColors.borderColor,
                  }}
                >
                  <div
                    className="p-3 rounded-lg border flex items-center justify-between"
                    style={{
                      backgroundColor: themeColors.surfaceColor,
                      borderColor: themeColors.borderColor,
                    }}
                  >
                    <span className="font-bold text-sm tracking-wider" style={{ color: themeColors.textColor }}>
                      {general.siteName}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: `${themeColors.primaryColor}25`,
                        color: themeColors.primaryColor,
                      }}
                    >
                      Active Theme
                    </span>
                  </div>

                  <div
                    className="p-4 rounded-lg border space-y-3"
                    style={{
                      backgroundColor: themeColors.cardColor,
                      borderColor: themeColors.borderColor,
                    }}
                  >
                    <div className="text-sm font-semibold" style={{ color: themeColors.textColor }}>
                      Sample Product Card
                    </div>
                    <div className="text-xs" style={{ color: themeColors.mutedColor }}>
                      Minimalist, high-performance digital commerce.
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-base" style={{ color: themeColors.secondaryColor }}>
                        {general.currencySymbol} 2,450
                      </span>
                      <button
                        type="button"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
                        style={{
                          backgroundColor: themeColors.primaryColor,
                          color: '#000000',
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: BRANDING & LOGOS */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>Store Logo</span>
              </CardTitle>
              <CardDescription>Primary logo displayed in header and footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Logo Image URL
                </label>
                <Input
                  value={branding.logoUrl}
                  onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                  placeholder="https://yourstore.com/logo.webp"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Transparent WebP or PNG format recommended (height: 40-50px).
                </span>
              </div>

              {branding.logoUrl && (
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground mb-2">Logo Preview</span>
                  <img src={branding.logoUrl} alt="Logo" className="max-h-12 object-contain" />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium">Display Tagline under Logo</span>
                <Switch
                  checked={branding.showTagline}
                  onCheckedChange={(checked) => setBranding({ ...branding, showTagline: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Flag className="w-4 h-4 text-primary" />
                <span>Browser Favicon & Site Icon</span>
              </CardTitle>
              <CardDescription>Small icon displayed in browser tab</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Favicon URL (.ico, .png, .svg)
                </label>
                <Input
                  value={branding.faviconUrl}
                  onChange={(e) => setBranding({ ...branding, faviconUrl: e.target.value })}
                  placeholder="https://yourstore.com/favicon.ico"
                />
              </div>

              {branding.faviconUrl && (
                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex items-center gap-3">
                  <img src={branding.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain rounded" />
                  <span className="text-xs text-muted-foreground">Favicon Preview (32x32)</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: BANNERS & PROMO */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Promo Announcement Banner */}
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Top Announcement / Promo Banner</span>
                  </CardTitle>
                  <CardDescription>Slim promotional bar at the very top of the storefront</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Enable Bar</span>
                  <Switch
                    checked={banners.promoBanner.enabled}
                    onCheckedChange={(checked) =>
                      setBanners({
                        ...banners,
                        promoBanner: { ...banners.promoBanner, enabled: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Promo Badge
                  </label>
                  <Input
                    value={banners.promoBanner.badge}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        promoBanner: { ...banners.promoBanner, badge: e.target.value },
                      })
                    }
                    placeholder="e.g., ⚡ Special Launch Offer"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Announcement Message
                  </label>
                  <Input
                    value={banners.promoBanner.text}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        promoBanner: { ...banners.promoBanner, text: e.target.value },
                      })
                    }
                    placeholder="e.g., Free Nationwide Delivery on Orders Over ৳ 2,000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Slider Carousel Banner */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Main Hero Slider Banner</span>
              </CardTitle>
              <CardDescription>Primary showcase banner displayed prominently on homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Banner Title
                  </label>
                  <Input
                    value={banners.heroBanners[0]?.title || ''}
                    onChange={(e) => {
                      const updated = [...banners.heroBanners];
                      updated[0] = { ...updated[0], title: e.target.value };
                      setBanners({ ...banners, heroBanners: updated });
                    }}
                    placeholder="e.g., Next-Gen Digital Commerce"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Badge / Tag
                  </label>
                  <Input
                    value={banners.heroBanners[0]?.badge || ''}
                    onChange={(e) => {
                      const updated = [...banners.heroBanners];
                      updated[0] = { ...updated[0], badge: e.target.value };
                      setBanners({ ...banners, heroBanners: updated });
                    }}
                    placeholder="e.g., New Arrival 2026"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Subtitle Description
                  </label>
                  <Input
                    value={banners.heroBanners[0]?.subtitle || ''}
                    onChange={(e) => {
                      const updated = [...banners.heroBanners];
                      updated[0] = { ...updated[0], subtitle: e.target.value };
                      setBanners({ ...banners, heroBanners: updated });
                    }}
                    placeholder="Minimalist, performance-first shopping experience"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Hero Banner Image URL
                  </label>
                  <Input
                    value={banners.heroBanners[0]?.imageUrl || ''}
                    onChange={(e) => {
                      const updated = [...banners.heroBanners];
                      updated[0] = { ...updated[0], imageUrl: e.target.value };
                      setBanners({ ...banners, heroBanners: updated });
                    }}
                    placeholder="https://images.unsplash.com/... or /uploads/banner.webp"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Page Banner */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>About Page Banner</span>
              </CardTitle>
              <CardDescription>Hero banner and introduction text for the /about page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    About Title
                  </label>
                  <Input
                    value={banners.aboutBanner.title}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        aboutBanner: { ...banners.aboutBanner, title: e.target.value },
                      })
                    }
                    placeholder="e.g., PLEXIVIA – Crafting Digital Dreams"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    About Subtitle Badge
                  </label>
                  <Input
                    value={banners.aboutBanner.subtitle}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        aboutBanner: { ...banners.aboutBanner, subtitle: e.target.value },
                      })
                    }
                    placeholder="e.g., Digital Development Agency"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Description Text
                  </label>
                  <Input
                    value={banners.aboutBanner.description}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        aboutBanner: { ...banners.aboutBanner, description: e.target.value },
                      })
                    }
                    placeholder="Detailed explanation of company mission and craftsmanship"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    About Banner Image URL
                  </label>
                  <Input
                    value={banners.aboutBanner.imageUrl}
                    onChange={(e) =>
                      setBanners({
                        ...banners,
                        aboutBanner: { ...banners.aboutBanner, imageUrl: e.target.value },
                      })
                    }
                    placeholder="https://images.unsplash.com/... or /uploads/about-banner.webp"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SiteConfigPage;
