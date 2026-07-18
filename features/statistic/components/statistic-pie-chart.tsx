import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CategoryStatistic } from '../type';
import { useColorScheme } from 'nativewind';

interface StatisticPieChartProps {
    data: CategoryStatistic[];
    total: number;
}

// A vibrant, premium color palette for charts
const CHART_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFD54F', // Yellow
    '#45B7D1', // Blue
    '#BA68C8', // Purple
    '#FFA07A', // Salmon
    '#98D8C8', // Mint
    '#F06292', // Pink
    '#4DB6AC', // Green
    '#7986CB', // Indigo
];

export function StatisticPieChart({ data, total }: StatisticPieChartProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = isDark ? '#FFFFFF' : '#000000';

    if (data.length === 0) {
        return (
            <View className="items-center justify-center py-12">
                <PieChart
                    donut={false}
                    data={[{ value: 1, color: isDark ? '#374151' : '#E5E7EB' }]} // Gray placeholder
                    radius={120}
                />
                <View className="absolute inset-0 items-center justify-center pointer-events-none">
                    <Text className="text-muted-foreground text-sm font-medium">No Data</Text>
                    <Text className="text-foreground text-xl font-bold mt-1">Rp 0</Text>
                </View>
            </View>
        );
    }

    const pieData = data.map((item, index) => {
        // Only show text for slices bigger than 5% so they don't overlap too much
        const showText = item.percentage >= 5;
        return {
            value: item.percentage,
            color: CHART_COLORS[index % CHART_COLORS.length],
            text: showText ? `${Math.round(item.percentage)}%` : '',
            textColor: '#FFFFFF', // Clean white text looks better
            textSize: 14,
            fontWeight: '900', // Extra bold for readability
        };
    });

    return (
        <View className="items-center justify-center py-10">
            <PieChart
                donut={false}
                radius={130}
                data={pieData}
                showText
                textColor="#FFFFFF"
                textSize={14}
                fontWeight="900"
                showTextBackground={false} // Remove the ugly white circles
                labelsPosition="mid" // Put the text neatly inside the slices
                focusOnPress={true} // Allow users to click slices
            />
        </View>
    );
}
