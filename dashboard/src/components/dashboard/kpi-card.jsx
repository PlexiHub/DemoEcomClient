import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const KpiCard = ({ title, value, icon: Icon, trend, trendDirection }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <p
          className={cn(
            'text-[10px] sm:text-xs mt-1',
            trendDirection === 'up' && 'text-emerald-500',
            trendDirection === 'down' && 'text-destructive',
            trendDirection === 'neutral' && 'text-muted-foreground'
          )}
        >
          {trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : ''}
          {trend} from last month
        </p>
      </CardContent>
    </Card>
  );
}
