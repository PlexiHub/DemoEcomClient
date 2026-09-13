import { createBrowserRouter, Navigate } from 'react-router-dom';

import DashboardLayout from './layouts/dashboardLayout';

import Login from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import InvitePage from './pages/invite';

import Overview from './pages/dashboard/overview';
import Analytics from './pages/dashboard/analytics';
import Users from './pages/dashboard/users';
import Reports from './pages/dashboard/reportsV2';
import Members from './pages/dashboard/members';
import Trash from './pages/dashboard/trash';
import ActivityLogs from './pages/dashboard/activityLogs';
import Reviews from './pages/dashboard/reviews';
import ProductShowcasesPage from './pages/dashboard/settings/productShowcases';
import MetaPixelPage from './pages/dashboard/settings/metaPixel';
import TikTokPixelPage from './pages/dashboard/settings/tiktokPixel';
import CMSContentPage from './pages/dashboard/settings/cmsContent';
import GoogleAnalyticsPage from './pages/dashboard/settings/googleAnalytics';
import SEOSettingsPage from './pages/dashboard/settings/seoSettings';
import SiteConfigPage from './pages/dashboard/settings/siteConfig';
import AllMedia from './pages/dashboard/allMedia';
import ProfilePage from './pages/dashboard/profile';

import ProductsList from './pages/dashboard/products/productsList';
import ProductDetails from './pages/dashboard/products/productDetails';
import AddNewProduct from './pages/dashboard/products/addNewProduct';
import OnSalePage from './pages/dashboard/products/onSalePage';
import MiniaturePage from './pages/dashboard/products/miniaturePage';
import Coupons from './pages/dashboard/products/coupons';
import SizeCharts from './pages/dashboard/products/sizeCharts';
import Categories from './pages/dashboard/products/categories';
import Brands from './pages/dashboard/products/brands';
import Attributes from './pages/dashboard/products/attributes';
import EditAttribute from './pages/dashboard/products/editAttribute';

import OrdersList from './pages/dashboard/orders/ordersList';
import OrderDetails from './pages/dashboard/orders/orderDetails';
import NewOrder from './pages/dashboard/orders/newOrder';
import InStoreOrders from './pages/dashboard/orders/inStoreOrders';

import BillingOverview from './pages/dashboard/billing/billingOverview';
import Payments from './pages/dashboard/billing/payments';
import Billings from './pages/dashboard/billing/billings';

import MessagesManager from './pages/dashboard/tools/messagesManager';
import BulkImageResize from './pages/dashboard/tools/bulkImageResize';
import MetaCatalog from './pages/dashboard/tools/metaCatalog';
import SystemLogs from './pages/dashboard/tools/systemLogs';
import SupportDesk from './pages/dashboard/tools/supportDesk';

import Studio from './pages/dashboard/studio/index';
import BatchImagesStudio from './pages/dashboard/studio/batchImages';

import RoleGuard from './components/RoleGuard';
import DemoRestrictedGuard from './components/DemoRestrictedGuard';
import NotFound from './components/NotFound';
import { RouteErrorElement } from './components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/invite',
    element: <InvitePage />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: '',
        element: (
          <RoleGuard menuKey="overview">
            <Overview />
          </RoleGuard>
        ),
      },
      {
        path: 'webmail',
        element: <Navigate to="/dashboard/tools/messages" replace />,
      },
      {
        path: 'users',
        element: (
          <RoleGuard menuKey="users">
            <DemoRestrictedGuard pageTitle="System Users">
              <Users />
            </DemoRestrictedGuard>
          </RoleGuard>
        ),
      },
      {
        path: 'reports',
        element: (
          <RoleGuard menuKey="reports">
            <Reports />
          </RoleGuard>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RoleGuard menuKey="analytics">
            <DemoRestrictedGuard pageTitle="Analytics">
              <Analytics />
            </DemoRestrictedGuard>
          </RoleGuard>
        ),
      },
      {
        path: 'customers',
        element: (
          <RoleGuard menuKey="members">
            <Members />
          </RoleGuard>
        ),
      },
      {
        path: 'members',
        element: <Navigate to="/dashboard/customers" replace />,
      },
      {
        path: 'reviews',
        element: <Navigate to="/dashboard/products/reviews" replace />,
      },
      {
        path: 'trash',
        element: (
          <RoleGuard menuKey="trash">
            <Trash />
          </RoleGuard>
        ),
      },
      {
        path: 'activity-logs',
        element: (
          <RoleGuard menuKey="activity-logs">
            <ActivityLogs />
          </RoleGuard>
        ),
      },
      {
        path: 'logs',
        element: (
          <RoleGuard menuKey="logs">
            <SystemLogs />
          </RoleGuard>
        ),
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'admin',
        element: <Navigate to="/dashboard/users" replace />,
      },
      {
        path: 'settings',
        children: [
          { path: '', element: <Navigate to="site-config" replace /> },
          { path: 'general', element: <Navigate to="/dashboard/settings/site-config" replace /> },
          {
            path: 'site-config',
            element: (
              <RoleGuard menuKey="settings">
                <SiteConfigPage />
              </RoleGuard>
            ),
          },
          {
            path: 'products',
            element: <Navigate to="/dashboard/products/showcases" replace />,
          },
          {
            path: 'meta-pixel',
            element: (
              <RoleGuard menuKey="settings.meta-pixel">
                <DemoRestrictedGuard pageTitle="Meta Pixel">
                  <MetaPixelPage />
                </DemoRestrictedGuard>
              </RoleGuard>
            ),
          },
          {
            path: 'tiktok-pixel',
            element: (
              <RoleGuard menuKey="settings.tiktok-pixel">
                <DemoRestrictedGuard pageTitle="TikTok Pixel">
                  <TikTokPixelPage />
                </DemoRestrictedGuard>
              </RoleGuard>
            ),
          },
          {
            path: 'cms-content',
            element: (
              <RoleGuard menuKey="settings.cms">
                <CMSContentPage />
              </RoleGuard>
            ),
          },
          { path: 'cms', element: <Navigate to="cms-content" replace /> },
          {
            path: 'google-analytics',
            element: (
              <RoleGuard menuKey="settings.google-analytics">
                <DemoRestrictedGuard pageTitle="Google Analytics">
                  <GoogleAnalyticsPage />
                </DemoRestrictedGuard>
              </RoleGuard>
            ),
          },
          {
            path: 'seo',
            element: (
              <RoleGuard menuKey="settings">
                <SEOSettingsPage />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'media',
        element: <AllMedia />,
      },
      {
        path: 'tools',
        children: [
          { path: '', element: <Navigate to="messages" replace /> },
          {
            path: 'messages',
            element: (
              <RoleGuard menuKey="tools.messages">
                <MessagesManager />
              </RoleGuard>
            ),
          },
          {
            path: 'assets',
            element: <Navigate to="/dashboard/settings/cms-content" replace />,
          },
          { path: 'media', element: <Navigate to="/dashboard/media" replace /> },
          {
            path: 'bulk-image-resize',
            element: (
              <RoleGuard menuKey="tools.bulk-image-resize">
                <BulkImageResize />
              </RoleGuard>
            ),
          },
          {
            path: 'meta-catalog',
            element: (
              <RoleGuard menuKey="tools.meta-catalog">
                <MetaCatalog />
              </RoleGuard>
            ),
          },
          {
            path: 'support',
            element: (
              <RoleGuard menuKey="tools.support">
                <SupportDesk />
              </RoleGuard>
            ),
          },
          { path: 'analytics', element: <Navigate to="/dashboard/analytics" replace /> },
          { path: 'activity-logs', element: <Navigate to="/dashboard/activity-logs" replace /> },
          { path: 'logs', element: <Navigate to="/dashboard/logs" replace /> },
        ],
      },
      { path: 'messages', element: <Navigate to="/dashboard/tools/messages" replace /> },
      {
        path: 'developer',
        children: [
          { path: 'bulk-image-resize', element: <Navigate to="/dashboard/tools/bulk-image-resize" replace /> },
          { path: 'meta-catalog', element: <Navigate to="/dashboard/tools/meta-catalog" replace /> },
          { path: 'logs', element: <Navigate to="/dashboard/logs" replace /> },
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            element: (
              <RoleGuard menuKey="products.list">
                <ProductsList />
              </RoleGuard>
            ),
          },
          {
            path: 'list',
            element: (
              <RoleGuard menuKey="products.list">
                <ProductsList />
              </RoleGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <RoleGuard menuKey="products.new">
                <AddNewProduct />
              </RoleGuard>
            ),
          },
          {
            path: 'on-sale',
            element: (
              <RoleGuard menuKey="products.onsale">
                <OnSalePage />
              </RoleGuard>
            ),
          },
          {
            path: 'miniature',
            element: (
              <RoleGuard menuKey="products.miniature">
                <MiniaturePage />
              </RoleGuard>
            ),
          },
          {
            path: 'showcases',
            element: (
              <RoleGuard menuKey="products.showcases">
                <ProductShowcasesPage />
              </RoleGuard>
            ),
          },
          {
            path: 'coupons',
            element: (
              <RoleGuard menuKey="products.coupons">
                <Coupons />
              </RoleGuard>
            ),
          },
          {
            path: 'size-charts',
            element: (
              <RoleGuard menuKey="products.size-charts">
                <SizeCharts />
              </RoleGuard>
            ),
          },
          {
            path: 'reviews',
            element: (
              <RoleGuard menuKey="products.reviews">
                <Reviews />
              </RoleGuard>
            ),
          },
          {
            path: 'categories',
            element: (
              <RoleGuard menuKey="products.categories">
                <Categories />
              </RoleGuard>
            ),
          },
          {
            path: 'brands',
            element: (
              <RoleGuard menuKey="products.brands">
                <Brands />
              </RoleGuard>
            ),
          },
          {
            path: 'attributes',
            element: (
              <RoleGuard menuKey="products.attributes">
                <Attributes />
              </RoleGuard>
            ),
          },
          {
            path: 'attributes/:id',
            element: (
              <RoleGuard menuKey="products.attributes">
                <EditAttribute />
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleGuard menuKey="products.list">
                <ProductDetails />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            element: (
              <RoleGuard menuKey="orders.list">
                <OrdersList />
              </RoleGuard>
            ),
          },
          {
            path: 'list',
            element: (
              <RoleGuard menuKey="orders.list">
                <OrdersList />
              </RoleGuard>
            ),
          },
          {
            path: 'in-store',
            element: (
              <RoleGuard menuKey="orders.instore">
                <InStoreOrders />
              </RoleGuard>
            ),
          },
          {
            path: 'instore',
            element: (
              <RoleGuard menuKey="orders.instore">
                <InStoreOrders />
              </RoleGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <RoleGuard menuKey="orders.new">
                <NewOrder />
              </RoleGuard>
            ),
          },
          {
            path: ':id',
            element: (
              <RoleGuard menuKey="orders.list">
                <OrderDetails />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'billing',
        children: [
          {
            path: '',
            element: (
              <RoleGuard menuKey="billing">
                <BillingOverview />
              </RoleGuard>
            ),
          },
          {
            path: 'payments',
            element: (
              <RoleGuard menuKey="billing.payments">
                <Payments />
              </RoleGuard>
            ),
          },
          {
            path: 'billings',
            element: (
              <RoleGuard menuKey="billing.billings">
                <Billings />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: 'studio',
        element: (
          <RoleGuard menuKey="studio">
            <Studio />
          </RoleGuard>
        ),
        children: [
          { path: '', element: <Navigate to="batch-images" replace /> },
          {
            path: 'batch-images',
            element: (
              <RoleGuard menuKey="studio.batch-images">
                <BatchImagesStudio />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
