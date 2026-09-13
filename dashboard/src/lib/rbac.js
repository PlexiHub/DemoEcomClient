import coreConfig from '@/config/core.json';

// Validates whether a specific user role has access to a given menu or submenu key
export const hasMenuAccess = (role, menuKey) => {
  if (!role || !menuKey) return false;

  const normalizedRole = String(role).trim();
  const lowerRole = normalizedRole.toLowerCase();

  if (lowerRole === 'owner' || lowerRole === 'admin') {
    return true;
  }

  const roleConfig =
    coreConfig?.userRoles?.[normalizedRole] ||
    coreConfig?.userRoles?.[normalizedRole.replace(/\s+/g, '-')] ||
    coreConfig?.userRoles?.[normalizedRole.replace(/-/g, ' ')] ||
    (lowerRole.includes('demo') ? coreConfig?.userRoles?.['Demo Client'] : null);

  if (!roleConfig || !Array.isArray(roleConfig.allowedMenus)) {
    return false;
  }

  const { allowedMenus } = roleConfig;

  if (allowedMenus.includes('*')) {
    return true;
  }

  if (allowedMenus.includes(menuKey)) {
    return true;
  }

  if (menuKey.includes('.')) {
    const parentKey = menuKey.split('.')[0];
    if (allowedMenus.includes(parentKey) && allowedMenus.includes(menuKey)) {
      return true;
    }
  }

  if (menuKey === 'tools.messages' && allowedMenus.includes('webmail')) {
    return true;
  }

  if (menuKey === 'members' && (allowedMenus.includes('customers') || allowedMenus.includes('customers.list'))) {
    return true;
  }

  if (menuKey === 'reviews' && allowedMenus.includes('products.reviews')) {
    return true;
  }

  return false;
};

// Gets the default landing route URL for a given role upon login
export const getDefaultRedirect = (role) => {
  if (!role) return '/login';

  if (hasMenuAccess(role, 'overview')) {
    return '/dashboard';
  }

  if (hasMenuAccess(role, 'products.list')) {
    return '/dashboard/products/list';
  }

  if (hasMenuAccess(role, 'orders.list')) {
    return '/dashboard/orders/list';
  }

  if (hasMenuAccess(role, 'tools.bulk-image-resize')) {
    return '/dashboard/tools/bulk-image-resize';
  }

  return '/dashboard';
};
