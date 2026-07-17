import { Text } from "@/components/ui/text"
import { View, ActivityIndicator } from "react-native"
import { Button } from "@/components/ui/button"
import { useAllWallets } from "@/features/wallet/hooks/use-all-wallets"
import { useRouter } from "expo-router"
import { Wallet } from "lucide-react-native"

export function TransactionScreen() {
    const { data, isLoading, isError, refetch } = useAllWallets();
    const router = useRouter();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center p-6">
                <Text className="text-destructive mb-4">Failed to load wallets</Text>
                <Button onPress={() => refetch()}><Text>Retry</Text></Button>
            </View>
        )
    }

    const wallets = data?.data || [];

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
        <View className="flex-1 p-6">
            <Text className="text-2xl font-bold">Transactions</Text>
            {/* transaction list goes here */}
        </View>
    )
}
