import { StatisticScreen } from '@/features/statistic/screen/statistic-screen';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function StatisticRoute() {
    return (
        <View className="flex-1">
            <StatisticScreen />
        </View>
    );
}