import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Store,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { handleGlobalError } from '@/lib/error-handler';
import { toast } from 'sonner';
import { BrandLogo } from '@/components/BrandLogo';
import plexiviaLogo from '@/assets/plexivia.png';

// Dedicated registration component for multi-tenant demo store clients
const RegisterPage = () => {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('luxury-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submits registration payload to the multi-tenant onboarding endpoint
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!storeName.trim() || !ownerName.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/api/v1/auth/register-demo', {
        storeName: storeName.trim(),
        name: ownerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        theme: selectedTheme,
      });

      const resData = response.data;
      if (resData.status === 'success') {
        if (resData.data?.accessToken) {
          localStorage.setItem('accessToken', resData.data.accessToken);
        }
        if (resData.data?.user) {
          localStorage.setItem('user', JSON.stringify(resData.data.user));
        }
        if (resData.data?.tenantId) {
          localStorage.setItem('tenantId', resData.data.tenantId);
        }

        toast.success('Your 48-hour demo store is live! Welcome aboard.');
        navigate('/dashboard');
      } else {
        toast.success('Registration completed! Please log in with your credentials.');
        navigate('/login');
      }
    } catch (err) {
      handleGlobalError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark min-h-screen w-screen bg-background text-foreground flex items-center justify-center p-3 relative overflow-y-auto font-sans selection:bg-primary/30 selection:text-primary py-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-70 animate-pulse [animation-duration:8s]" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse [animation-duration:12s]" />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-45 animate-pulse [animation-duration:10s]" />

      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[440px] relative z-10 my-auto"
      >
        <Card className="shadow-2xl border-border bg-card/90 text-card-foreground backdrop-blur-xl overflow-hidden rounded-2xl">
          <CardHeader className="px-5 pt-5 pb-3 text-center border-b border-border/80 bg-card/40">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center justify-center gap-1.5 text-foreground">
              <BrandLogo className="w-[180px] sm:w-[210px] h-12 mx-auto mb-2" centered />
            </CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              Launch your 48-Hour Multi-Tenant Demo Store & Admin Sandbox
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-3.5">
            <div className="p-3 rounded-xl border border-primary/30 bg-primary/10 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>তাৎক্ষণিক ডেমো স্যান্ডবক্স অ্যাক্টিভেশন</span>
              </div>
              <p className="text-[11px] text-foreground/90 leading-relaxed font-medium">
                রেজিস্ট্রেশন করার সাথে সাথে আপনার জন্য আলাদা একটি ক্লাউড ডাটাবেজ তৈরি হবে। ২ দিন পর্যন্ত সম্পূর্ণ ফ্রিতে স্টোর ও ড্যাশবোর্ড টেস্ট করুন।
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Store / Brand Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                    <Store className="h-3.5 w-3.5" />
                  </span>
                  <Input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="pl-9 h-9 text-xs bg-background/60 border-border text-foreground focus:border-primary placeholder:text-muted-foreground/40 rounded-lg"
                    placeholder="e.g. Elegance Fragrance"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Owner / Full Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                    <User className="h-3.5 w-3.5" />
                  </span>
                  <Input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="pl-9 h-9 text-xs bg-background/60 border-border text-foreground focus:border-primary placeholder:text-muted-foreground/40 rounded-lg"
                    placeholder="e.g. Rahim Ahmed"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-muted-foreground">
                    Email Address *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-9 text-xs bg-background/60 border-border text-foreground focus:border-primary placeholder:text-muted-foreground/40 rounded-lg"
                      placeholder="owner@brand.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-muted-foreground">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 h-9 text-xs bg-background/60 border-border text-foreground focus:border-primary placeholder:text-muted-foreground/40 rounded-lg"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground">
                  Select Storefront Template
                </label>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('luxury-1')}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-1 transition cursor-pointer ${
                      selectedTheme === 'luxury-1'
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background/40 text-muted-foreground hover:bg-background/70'
                    }`}
                  >
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Palette className="h-3 w-3 text-primary" />
                      Luxury Dark
                    </span>
                    <span className="text-[10px] text-muted-foreground">Decantre Gold Edition</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTheme('default')}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-1 transition cursor-pointer ${
                      selectedTheme === 'default'
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background/40 text-muted-foreground hover:bg-background/70'
                    }`}
                  >
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Palette className="h-3 w-3 text-primary" />
                      Tech Cyan
                    </span>
                    <span className="text-[10px] text-muted-foreground">Plexivia Cyber Edition</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-muted-foreground">
                    Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-8 h-9 text-xs bg-background/60 border-border text-foreground focus:border-primary placeholder:text-muted-foreground/40 rounded-lg"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-muted-foreground">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/60">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 h-9 text-xs bg-background/60 border-border text-foreground focus:border-primary placeholder:text-muted-foreground/40 rounded-lg"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="w-full h-9 flex items-center justify-center font-semibold text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition cursor-pointer shadow-md rounded-lg"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-1.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {isSubmitting ? 'Creating Sandbox…' : 'Create Demo Store (48 Hours)'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="w-full h-9 flex items-center justify-center font-semibold text-xs bg-secondary hover:bg-secondary/90 text-secondary-foreground transition cursor-pointer shadow-sm rounded-lg"
                >
                  Already have an account? Log In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex flex-col items-end gap-1 select-none pointer-events-auto">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-muted-foreground/75">
          Powered By
        </span>
        <img
          src={plexiviaLogo}
          alt="Plexivia"
          className="h-5 sm:h-6 w-auto max-w-[120px] sm:max-w-[140px] object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
