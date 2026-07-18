import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { FlatTransaction } from '../type';
import { 
  format, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
} from 'date-fns';

export function CalendarView({ 
  transactions, 
  currentDate,
  onDatePress
}: { 
  transactions: FlatTransaction[], 
  currentDate: Date,
  onDatePress?: (date: string) => void
}) {
  const totalIncome = transactions.filter(t => t.direction === 'IN').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.direction === 'OUT').reduce((sum, t) => sum + Number(t.amount), 0);
  const total = totalIncome - totalExpense;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount);
  };
  
  const formatMoneyShort = (amount: number) => {
      if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
      if (amount >= 1000) return (amount / 1000).toFixed(1) + 'K';
      return amount.toString();
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'yyyy-MM-dd');
      
      const dayTransactions = transactions.filter(t => {
          return format(parseISO(t.date), 'yyyy-MM-dd') === formattedDate;
      });
      
      const dayIncome = dayTransactions.filter(t => t.direction === 'IN').reduce((sum, t) => sum + Number(t.amount), 0);
      const dayExpense = dayTransactions.filter(t => t.direction === 'OUT').reduce((sum, t) => sum + Number(t.amount), 0);

      days.push({
          date: day,
          formattedDate,
          isCurrentMonth: isSameMonth(day, monthStart),
          dayIncome,
          dayExpense
      });
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const { width } = Dimensions.get('window');
  const cellWidth = width / 7;

  return (
    <View className="flex-1">
      {/* Monthly Summary Header */}
      <View className="flex-row py-3 border-b border-border bg-card">
        <View className="flex-1 items-center">
          <Text className="text-muted-foreground text-xs mb-1">Income</Text>
          <Text className="text-blue-500 font-medium">{formatMoney(totalIncome)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-muted-foreground text-xs mb-1">Expenses</Text>
          <Text className="text-red-500 font-medium">{formatMoney(totalExpense)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-muted-foreground text-xs mb-1">Total</Text>
          <Text className="text-foreground font-medium">{formatMoney(total)}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-card">
        {/* Days of week header */}
        <View className="flex-row border-b border-border py-2 bg-muted/20">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <View key={d} style={{ width: cellWidth }} className="items-center">
                    <Text className={`text-xs ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-muted-foreground'}`}>{d}</Text>
                </View>
            ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-1">
            {rows.map((row, i) => (
                <View key={i} className="flex-row border-b border-border">
                    {row.map((dayData, j) => (
                        <TouchableOpacity 
                            key={dayData.formattedDate} 
                            style={{ width: cellWidth, height: 80 }} 
                            className={`p-1 border-r border-border ${!dayData.isCurrentMonth ? 'bg-muted/10' : ''}`}
                            onPress={() => onDatePress?.(dayData.formattedDate)}
                        >
                            <Text className={`text-xs ${!dayData.isCurrentMonth ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                                {format(dayData.date, 'd')}
                            </Text>
                            
                            <View className="mt-1 gap-0.5">

                                {dayData.dayIncome > 0 && (
                                    <Text className="text-[9px] text-blue-500" numberOfLines={1}>+{formatMoneyShort(dayData.dayIncome)}</Text>
                                )}
                                {dayData.dayExpense > 0 && (
                                    <Text className="text-[9px] text-red-500" numberOfLines={1}>-{formatMoneyShort(dayData.dayExpense)}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
