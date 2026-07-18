import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CategoryStatistic } from '../type';
import { useColorScheme } from 'nativewind';

interface ExpenseDonutChartProps {
    expenses: CategoryStatistic[];
    totalExpense: number;
}

// A vibrant, premium color palette for charts
const CHART_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Salmon
    '#98D8C8', // Mint
    '#F06292', // Pink
    '#BA68C8', // Purple
    '#FFD54F', // Yellow
    '#4DB6AC', // Green
    '#7986CB', // Indigo
];

export function ExpenseDonutChart({ expenses, totalExpense }: ExpenseDonutChartProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const centerLabelColor = isDark ? '#9CA3AF' : '#6B7280'; // muted foreground

    // If there are no expenses, show an empty state chart
    if (expenses.length === 0) {
        return (
            <View className="items-center justify-center py-8">
                <PieChart
                    donut
                    data={[{ value: 1, color: isDark ? '#374151' : '#E5E7EB' }]} // Gray placeholder
                    innerRadius={70}
                    radius={100}
                    centerLabelComponent={() => (
                        <View className="items-center justify-center">
                            <Text className="text-muted-foreground text-sm font-medium">No Data</Text>
                            <Text className="text-foreground text-xl font-bold mt-1">Rp 0</Text>
                        </View>
                    )}
                />
            </View>
        );
    }

    const pieData = expenses.map((expense, index) => ({
        value: expense.percentage,
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: expense.percentage >= 5 ? `${Math.round(expense.percentage)}%` : '',
        textColor: '#FFFFFF', // Keep text white for better contrast on colors
        fontWeight: 'bold',
        textSize: 12,
    }));

    const formatMoney = (amount: number) => {
        if (amount >= 1000000) {
            return `Rp ${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `Rp ${(amount / 1000).toFixed(0)}K`;
        }
        return `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount)}`;
    };

    return (
        <View className="items-center justify-center py-6">
            <PieChart
                donut
                innerRadius={75}
                radius={110}
                data={pieData}
                innerCircleColor={isDark ? '#000000' : '#FFFFFF'} // Match background
                centerLabelComponent={() => (
                    <View className="items-center justify-center px-2">
                        <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1" style={{ color: centerLabelColor }}>
                            Total Expenses
                        </Text>
                        <Text className="text-foreground text-2xl font-bold" style={{ color: textColor }}>
                            {formatMoney(totalExpense)}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
