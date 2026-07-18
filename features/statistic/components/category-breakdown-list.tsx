import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CategoryStatistic } from '../type';

interface CategoryBreakdownListProps {
    expenses: CategoryStatistic[];
}

const CHART_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#BA68C8', '#FFD54F', '#4DB6AC', '#7986CB',
];

export function CategoryBreakdownList({ expenses }: CategoryBreakdownListProps) {
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2 }).format(amount);
    };

    if (expenses.length === 0) {
        return null;
    }

    return (
        <View className="px-4 pb-8 w-full">
            <View className="bg-card rounded-xl border border-border overflow-hidden">
                {expenses.map((expense, index) => {
                    const color = CHART_COLORS[index % CHART_COLORS.length];
                    const isLast = index === expenses.length - 1;

                    return (
                        <View 
                            key={expense.categoryId} 
                            className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-border/50' : ''}`}
                        >
                            <View className="flex-row items-center flex-1">
                                <View 
                                    className="px-2 py-1 rounded" 
                                    style={{ backgroundColor: `${color}30` }} // 30% opacity for background
                                >
                                    <Text className="text-xs font-bold" style={{ color }}>
                                        {Math.round(expense.percentage)}%
                                    </Text>
                                </View>
                                <Text className="font-medium text-foreground ml-3 text-base flex-1">
                                    {expense.categoryName}
                                </Text>
                            </View>
                            <View className="items-end pl-2">
                                <Text className="font-medium text-foreground text-base">
                                    Rp {formatMoney(expense.totalAmount)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
