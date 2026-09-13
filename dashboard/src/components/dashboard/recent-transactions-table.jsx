import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/use-orders';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

// RecentTransactionsTable component
export const RecentTransactionsTable = () => {
  const { data: ordersData, isLoading } = useOrders({ limit: 5, page: 1 });
  const orders = ordersData?.data || [];

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'paid':
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 dark:text-emerald-400 border-0 text-[10px] sm:text-xs">Completed</Badge>;
      case 'processing':
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 dark:text-amber-400 border-0 text-[10px] sm:text-xs">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 dark:text-blue-400 border-0 text-[10px] sm:text-xs">Shipped</Badge>;
      case 'failed':
      case 'cancelled':
        return <Badge variant="destructive" className="border-0 text-[10px] sm:text-xs">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] sm:text-xs">{status || 'Pending'}</Badge>;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-6">
        <div>
          <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Latest orders placed in the store.</CardDescription>
        </div>
        <Link
          to="/dashboard/orders"
          className="text-xs text-primary hover:underline font-medium"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] sm:w-[100px] text-xs">Order ID</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Customer</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : orders.length > 0 ? (
                orders.slice(0, 5).map((tx) => (
                  <TableRow key={tx.id || tx.orderNumber}>
                    <TableCell className="font-medium text-xs font-mono">
                      <Link to={`/dashboard/orders/${tx.id || tx.orderNumber}`} className="hover:underline text-primary">
                        {tx.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs hidden sm:table-cell" title={tx.customerName}>
                      {tx.customerName}
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.orderStatus || tx.paymentStatus)}</TableCell>
                    <TableCell className="text-right font-semibold text-xs">
                      ৳{Number(tx.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
