import { Text } from "@/components/ui/text"
import { View, ActivityIndicator, TouchableOpacity } from "react-native"
import { Button } from "@/components/ui/button"
import { useAllWallets } from "@/features/wallet/hooks/use-all-wallets"
import { Tabs, useRouter } from "expo-router"
import { Wallet, Plus, ChevronLeft, ChevronRight } from "lucide-react-native"
import { useState } from "react"
import { useColorScheme } from "nativewind"
import { NAV_THEME } from "@/lib/theme"
import { startOfMonth, endOfMonth, format, parseISO } from "date-fns"
import { useGetTransactions } from "../hooks/use-get-transactions"
import { TransactionViewTabs, ViewTabType } from "../components/transaction-view-tabs"
import { DailyView } from "../components/daily-view"
import { CalendarView } from "../components/calendar-view"
import { FlatTransaction } from "../type"
import { MonthYearPicker } from "../components/month-year-picker"

export function TransactionScreen() {
    const { data: walletsData, isLoading: isLoadingWallets, isError: isErrorWallets, refetch: refetchWallets } = useAllWallets();
    const router = useRouter();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState<ViewTabType>('Daily');
    
    const [selectedDatesMap, setSelectedDatesMap] = useState<Record<string, string>>({
        [format(new Date(), 'yyyy-MM')]: format(new Date(), 'yyyy-MM-dd')
    });
    
    const selectedDate = selectedDatesMap[format(currentDate, 'yyyy-MM')] || null;
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const { colorScheme } = useColorScheme();
    const theme = NAV_THEME[colorScheme ?? 'light'];

    const handleMonthChange = (newDate: Date) => {
        const monthKey = format(newDate, 'yyyy-MM');
        if (!selectedDatesMap[monthKey]) {
            let defaultDateStr: string;
            // Compare year and month to determine direction
            const newMonthValue = newDate.getFullYear() * 12 + newDate.getMonth();
            const currentMonthValue = currentDate.getFullYear() * 12 + currentDate.getMonth();
            
            if (newMonthValue > currentMonthValue) {
                defaultDateStr = format(startOfMonth(newDate), 'yyyy-MM-dd');
            } else {
                defaultDateStr = format(endOfMonth(newDate), 'yyyy-MM-dd');
            }
            setSelectedDatesMap(prev => ({ ...prev, [monthKey]: defaultDateStr }));
        }
        setCurrentDate(newDate);
    };

    const nextMonth = () => {
        handleMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }

    const prevMonth = () => {
        handleMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const startDateStr = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const endDateStr = format(endOfMonth(currentDate), 'yyyy-MM-dd');
    
    const { 
        data: transactionsData, 
        isLoading: isLoadingTransactions, 
        isError: isErrorTransactions,
        refetch: refetchTransactions
    } = useGetTransactions(startDateStr, endDateStr);

    if (isLoadingWallets || isLoadingTransactions) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (isErrorWallets || isErrorTransactions) {
        return (
            <View className="flex-1 items-center justify-center p-6">
                <Text className="text-destructive mb-4">Failed to load data</Text>
                <Button onPress={() => { refetchWallets(); refetchTransactions(); }}><Text>Retry</Text></Button>
            </View>
        )
    }

    const wallets = walletsData?.data || [];
    const transactions = transactionsData?.data || [];
    
    // Flatten the nested transactions/entries for the views
    const flatTransactions: FlatTransaction[] = transactions.flatMap((t): FlatTransaction[] => {
        if (!t.entries) return [];
        
        // If there are multiple entries, it's a Transfer
        if (t.entries.length > 1) {
            const outEntry = t.entries.find(e => e.direction === 'OUT') || t.entries[0];
            const inEntry = t.entries.find(e => e.direction === 'IN');
            return [{
                id: t.id, // Use transaction ID as it represents the whole transfer
                transactionId: t.id,
                description: t.description,
                date: t.date,
                accountId: outEntry.accountId,
                destinationAccountId: inEntry?.accountId,
                categoryId: outEntry.categoryId,
                amount: outEntry.amount,
                direction: 'TRANSFER' as const,
            }];
        }
        
        // Otherwise, it's a normal Income or Expense
        return t.entries.map(e => ({
            id: e.id,
            transactionId: t.id,
            description: t.description,
            date: t.date,
            accountId: e.accountId,
            categoryId: e.categoryId,
            amount: e.amount,
            direction: e.direction,
        }));
    });

    if (wallets.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-6 gap-4">
                <View className="bg-secondary p-6 rounded-full mb-2">
                    <Wallet size={48} color="gray" />
                </View>
                <Text className="text-xl font-semibold text-center">No Wallet Found</Text>
                <Text className="text-muted-foreground text-center mb-4">
                    You need to create a wallet before you can make any transactions.
                </Text>
                <Button onPress={() => router.push('/(protected)/accounts')} className="w-full">
                    <Text>Go to Accounts</Text>
                </Button>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-background relative">
            <Tabs.Screen 
                options={{
                    headerTitle: '',
                    headerLeft: () => (
                        <View className="flex-row items-center ml-4 gap-3">
                            <TouchableOpacity onPress={prevMonth} className="p-1">
                                <ChevronLeft color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <Text className="text-lg font-medium w-20 text-center">{formattedDate}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextMonth} className="p-1">
                                <ChevronRight color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
            
            <TransactionViewTabs 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                    setActiveTab(tab);
                }} 
            />
            
            <View className="flex-1">
                {activeTab === 'Daily' && <DailyView transactions={flatTransactions} selectedDate={selectedDate} />}
                {activeTab === 'Calendar' && (
                    <CalendarView 
                        transactions={flatTransactions} 
                        currentDate={currentDate} 
                        onDatePress={(date) => {
                            const parsed = parseISO(date);
                            const monthKey = format(parsed, 'yyyy-MM');
                            setSelectedDatesMap(prev => ({ ...prev, [monthKey]: date }));
                            setCurrentDate(parsed);
                            setActiveTab('Daily');
                        }}
                    />
                )}
                {['Monthly', 'Total', 'Note'].includes(activeTab) && (
                    <View className="flex-1 items-center justify-center p-6">
                        <Text className="text-muted-foreground">Not implemented yet.</Text>
                    </View>
                )}
            </View>

            <Button
                variant="default"
                size="icon"
                className="absolute bottom-6 right-6 rounded-full h-14 w-14 shadow-lg shadow-black/20 z-50"
                onPress={() => router.push({
                    pathname: '/(protected)/transaction-create',
                    params: { date: selectedDate || '' }
                })}
            >
                <Plus color="black" size={24} />
            </Button>

            <MonthYearPicker
                value={currentDate}
                open={showDatePicker}
                onOpenChange={setShowDatePicker}
                onChange={(date) => {
                    handleMonthChange(date);
                    setShowDatePicker(false);
                }}
            />
        </View>
    )
}
