import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { clientConfig } from '@/clientConfig';
import { baseURL, resolveImageUrl } from '@/lib/api-client';
import plexiviaLogo from '@/assets/plexivia.png';

// Renders the tenant branding logo with fixed proportional width and dynamic height
export const BrandLogo = ({
  src,
  className = 'w-[115px] h-auto',
  imgClassName = '',
  alt = 'Brand logo',
  iconOnly: _iconOnly = false,
  centered = false,
}) => {
  const { clientKey = 'demo', brandName = 'Plexivia', logoUrl } = clientConfig || {};

  const [logoVersion, setLogoVersion] = useState(() => {
    try {
      return localStorage.getItem('brand_logo_version') || '';
    } catch {
      return '';
    }
  });

  const isDemoClient = !clientKey || clientKey === 'demo';
  const isDefaultAssetLogo = !logoUrl || logoUrl === '/uploads/assets/logo.webp' || logoUrl.includes('demo_logo');
  const rawUrl = src || (!isDefaultAssetLogo ? logoUrl : (isDemoClient ? plexiviaLogo : '/uploads/assets/logo.webp'));

  // Resolves image paths and appends version query string for real-time asset invalidation
  const resolveLogoUrl = (url, version) => {
    if (!url) return null;
    if (url === plexiviaLogo || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/src/assets/')) {
      return url;
    }
    let finalUrl = resolveImageUrl(url);
    if (version && !finalUrl.startsWith('data:') && !finalUrl.startsWith('blob:')) {
      finalUrl += `${finalUrl.includes('?') ? '&' : '?'}v=${version}`;
    }
    return finalUrl;
  };

  const primaryUrl = resolveLogoUrl(rawUrl, logoVersion);
  const [currentSrc, setCurrentSrc] = useState(primaryUrl);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!isDemoClient && baseURL) {
      axios.get(`${baseURL}/api/v1/assets/logo-info`, { timeout: 3000 }).then((res) => {
        if (res?.data?.data?.version) {
          setLogoVersion(res.data.data.version);
          try {
            localStorage.setItem('brand_logo_version', String(res.data.data.version));
          } catch {}
        }
      }).catch(() => {});
    }

    const handleLogoUpdated = (e) => {
      const newVersion = e?.detail?.timestamp || Date.now();
      setLogoVersion(newVersion);
      try {
        localStorage.setItem('brand_logo_version', String(newVersion));
      } catch {}
    };

    window.addEventListener('brand-logo-updated', handleLogoUpdated);
    return () => {
      window.removeEventListener('brand-logo-updated', handleLogoUpdated);
    };
  }, [isDemoClient]);

  useEffect(() => {
    setCurrentSrc(primaryUrl);
    setImageError(false);
  }, [primaryUrl]);

  // Handles image load failures and cleanly triggers text badge fallback
  const handleImageError = () => {
    setImageError(true);
  };

  const isCentered = centered || className.includes('mx-auto') || className.includes('justify-center');

  if (currentSrc && !imageError) {
    return (
      <div className={`relative overflow-hidden flex items-center shrink-0 ${isCentered ? 'justify-center' : 'justify-start'} ${className}`}>
        <img
          src={currentSrc}
          alt={alt || brandName}
          className={`w-full h-full object-contain ${isCentered ? 'object-center mx-auto' : 'object-left'} ${imgClassName}`}
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden flex items-center shrink-0 ${isCentered ? 'justify-center' : 'justify-start'} ${className}`}>
      <img
        src={plexiviaLogo}
        alt="Plexivia"
        className={`w-full h-full object-contain ${isCentered ? 'object-center mx-auto' : 'object-left'} ${imgClassName}`}
      />
    </div>
  );
};

export default BrandLogo;
