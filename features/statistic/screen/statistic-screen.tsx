import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useGetStatistics } from '../hooks/use-get-statistics';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import { MonthYearPicker } from '@/features/transaction/components/month-year-picker';
import { Tabs } from 'expo-router';
import { StatisticPieChart } from '../components/statistic-pie-chart';
import { CategoryBreakdownList } from '../components/category-breakdown-list';
import { Button } from '@/components/ui/button';

export function StatisticScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeTab, setActiveTab] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

    const { colorScheme } = useColorScheme();
    const theme = NAV_THEME[colorScheme ?? 'light'];

    const handleMonthChange = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    const nextMonth = () => {
        handleMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        handleMonthChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const startDateStr = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const endDateStr = format(endOfMonth(currentDate), 'yyyy-MM-dd');

    const { data, isLoading, isError, refetch } = useGetStatistics(startDateStr, endDateStr);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isError || !data?.data) {
        return (
            <View className="flex-1 items-center justify-center bg-background p-6">
                <Text className="text-destructive mb-4 text-center">Failed to load statistics.</Text>
                <Button onPress={() => refetch()}><Text>Retry</Text></Button>
            </View>
        );
    }

    const statistics = data.data;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(amount);
    };

    const currentData = activeTab === 'INCOME' ? statistics.incomeByCategory : statistics.expenseByCategory;
    const currentTotal = activeTab === 'INCOME' ? statistics.summary.totalIncome : statistics.summary.totalExpense;

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

            {/* Custom Header Tabs */}
            <View className="flex-row items-center border-b border-border bg-card">
                <TouchableOpacity 
                    className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'INCOME' ? 'border-primary' : 'border-transparent'}`}
                    onPress={() => setActiveTab('INCOME')}
                >
                    <Text className={`text-xs font-medium mb-1 uppercase tracking-wider ${activeTab === 'INCOME' ? 'text-primary' : 'text-muted-foreground'}`}>Income</Text>
                    <Text className={`font-bold ${activeTab === 'INCOME' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Rp {formatMoney(statistics.summary.totalIncome)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'EXPENSE' ? 'border-destructive' : 'border-transparent'}`}
                    onPress={() => setActiveTab('EXPENSE')}
                >
                    <Text className={`text-xs font-medium mb-1 uppercase tracking-wider ${activeTab === 'EXPENSE' ? 'text-destructive' : 'text-muted-foreground'}`}>Expenses</Text>
                    <Text className={`font-bold ${activeTab === 'EXPENSE' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Rp {formatMoney(statistics.summary.totalExpense)}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* 1. Pie Chart */}
                <StatisticPieChart 
                    data={currentData} 
                    total={currentTotal} 
                />

                {/* 2. Category Breakdown List */}
                <CategoryBreakdownList expenses={currentData} />
            </ScrollView>

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
    );
}
