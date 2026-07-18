import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { FlatTransaction } from '../type';
import { format, parseISO } from 'date-fns';
import { useAllWallets } from '@/features/wallet/hooks/use-all-wallets';
import { useGetCategories } from '@/features/category/hooks/use-get-categories';
import { TransactionActionDialog } from './transaction-action-dialog';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

export function DailyView({ transactions, selectedDate }: { transactions: FlatTransaction[], selectedDate?: string | null }) {
  const router = useRouter();
  const { data: walletsData } = useAllWallets();
  const { data: categoriesData } = useGetCategories();
  
  const [selectedTransaction, setSelectedTransaction] = useState<FlatTransaction | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const wallets = walletsData?.data || [];
  const categories = categoriesData?.data || [];

  const getWalletName = (id: string) => wallets.find(w => w.id === id)?.name || 'Unknown Account';
  const getCategoryName = (id?: string) => categories.find(c => c.id === id)?.name || 'Transfer';

  // Group transactions by date
  const grouped = transactions.reduce((acc, t) => {
    const dateKey = format(parseISO(t.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {} as Record<string, FlatTransaction[]>);

  let sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a)); // Descending

  if (selectedDate) {
    sortedDates = [selectedDate];
  }

  const totalIncome = transactions.filter(t => t.direction === 'IN').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.direction === 'OUT').reduce((sum, t) => sum + Number(t.amount), 0);
  const total = totalIncome - totalExpense;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount);
  };

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

      <ScrollView className="flex-1">
        {sortedDates.length === 0 ? (
          <View className="flex-1 items-center justify-center p-10 gap-3 mt-20">
             <View className="bg-secondary/40 p-6 rounded-full mb-2">
                 <Text className="text-5xl">🍃</Text>
             </View>
             <Text className="text-xl font-bold text-foreground text-center">It's quiet here</Text>
             <Text className="text-muted-foreground text-center mb-4 leading-5">
                 You don't have any transactions for this month yet. Let's add one to start tracking your money!
             </Text>
             <Button size="sm" variant="outline" className="px-6 border-primary/50" onPress={() => router.push('/(protected)/transaction-create')}>
                 <Text className="text-primary font-medium">Add Transaction</Text>
             </Button>
          </View>
        ) : (
          sortedDates.map(date => {
            const dayTransactions = grouped[date] || [];
            const dayIncome = dayTransactions.filter(t => t.direction === 'IN').reduce((sum, t) => sum + Number(t.amount), 0);
            const dayExpense = dayTransactions.filter(t => t.direction === 'OUT').reduce((sum, t) => sum + Number(t.amount), 0);

            const parsedDate = parseISO(date);
            const dayNum = format(parsedDate, 'dd');
            const dayName = format(parsedDate, 'E');
            const monthYear = format(parsedDate, 'MM.yyyy');

            return (
              <View key={date} className="mb-4">
                {/* Daily Header */}
                <View className="flex-row items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xl font-bold">{dayNum}</Text>
                    <View className="bg-primary/20 px-1 rounded">
                       <Text className="text-[10px] text-primary">{dayName}</Text>
                    </View>
                    <Text className="text-xs text-muted-foreground">{monthYear}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    {dayIncome > 0 && <Text className="text-blue-500 text-sm">Rp {formatMoney(dayIncome)}</Text>}
                    {dayExpense > 0 && <Text className="text-red-500 text-sm">Rp {formatMoney(dayExpense)}</Text>}
                  </View>
                </View>

                {/* Transactions List */}
                {dayTransactions.length === 0 ? (
                  <View className="flex-1 items-center justify-center p-10 gap-3 mt-4">
                     <View className="bg-secondary/40 p-6 rounded-full mb-2">
                         <Text className="text-5xl">🍃</Text>
                     </View>
                     <Text className="text-xl font-bold text-foreground text-center">It's quiet here</Text>
                     <Text className="text-muted-foreground text-center mb-4 leading-5">
                         You don't have any transactions for this date yet. Let's add one to start tracking your money!
                     </Text>
                     <Button size="sm" variant="outline" className="px-6 border-primary/50" onPress={() => router.push('/(protected)/transaction-create')}>
                         <Text className="text-primary font-medium">Add Transaction</Text>
                     </Button>
                  </View>
                ) : (
                  <View className="bg-card">
                    {dayTransactions.map((t, idx) => (
                      <TouchableOpacity 
                        key={t.id} 
                        className={`flex-row items-center justify-between px-4 py-3 ${idx !== dayTransactions.length - 1 ? 'border-b border-border' : ''}`}
                        onPress={() => {
                          setSelectedTransaction(t);
                          setIsActionDialogOpen(true);
                        }}
                      >
                        <View className="flex-row items-center flex-1">
                          <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center mr-3">
                              <Text className="text-xs">{t.categoryId ? '🛒' : '🔄'}</Text>
                          </View>
                          <View className="flex-1">
                              <Text className="font-medium text-foreground">{t.description}</Text>
                              <View className="flex-row items-center mt-0.5">
                                  {t.direction === 'TRANSFER' && t.destinationAccountId ? (
                                      <Text className="text-xs text-muted-foreground">Transfer • {getWalletName(t.accountId)} ➔ {getWalletName(t.destinationAccountId)}</Text>
                                  ) : (
                                      <>
                                          <Text className="text-xs text-muted-foreground">{getCategoryName(t.categoryId)}</Text>
                                          <Text className="text-xs text-muted-foreground mx-1">•</Text>
                                          <Text className="text-xs text-muted-foreground">{getWalletName(t.accountId)}</Text>
                                      </>
                                  )}
                              </View>
                          </View>
                        </View>
                        <Text className={`font-medium ${t.direction === 'IN' ? 'text-blue-500' : t.direction === 'OUT' ? 'text-red-500' : 'text-foreground'}`}>
                          Rp {formatMoney(Number(t.amount))}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <TransactionActionDialog
        transaction={selectedTransaction}
        open={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        onEdit={(tx) => {
          // Navigate to edit screen
          router.push(`/(protected)/transaction-edit/${tx.transactionId}`);
        }}
      />
    </View>
  );
}
