import React from 'react';
import { View, Text } from 'react-native';
import { StatisticsSummary } from '../type';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';

interface StatisticSummaryProps {
    summary: StatisticsSummary;
}

export function StatisticSummary({ summary }: StatisticSummaryProps) {
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <View className="flex-row items-center justify-between p-4 bg-card rounded-2xl mx-4 mb-6 shadow-sm border border-border">
            <View className="flex-1 items-center border-r border-border/50">
                <Text className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">Income</Text>
                <Text className="text-blue-500 font-bold text-base">
                    Rp {formatMoney(summary.totalIncome)}
                </Text>
            </View>
            <View className="flex-1 items-center border-r border-border/50">
                <Text className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">Expenses</Text>
                <Text className="text-red-500 font-bold text-base">
                    Rp {formatMoney(summary.totalExpense)}
                </Text>
            </View>
            <View className="flex-1 items-center">
                <Text className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">Total</Text>
                <Text className="text-foreground font-bold text-base">
                    Rp {formatMoney(summary.netBalance)}
                </Text>
            </View>
        </View>
    );
}
