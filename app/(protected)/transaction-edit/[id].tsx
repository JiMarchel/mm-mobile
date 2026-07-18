import { EditTransactionScreen } from '@/features/transaction/screen/edit-transaction-screen';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function EditTransactionRoute() {
    return (
        <View className="flex-1">
            <Stack.Screen options={{ headerShown: false }} />
            <EditTransactionScreen />
        </View>
    );
}
