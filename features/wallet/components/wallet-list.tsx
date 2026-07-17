import { View, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAllWallets } from '../hooks/use-all-wallets';
import { WalletCard } from './wallet-card';

export function WalletList() {
  const { data, isLoading, isError, refetch } = useAllWallets();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-6 gap-4">
        <Text className="text-destructive text-center">Failed to load wallets</Text>
        <Button onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const wallets = data?.data || [];

  if (wallets.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground text-center">
          You don't have any wallets yet. Click the + button to create one.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wallets}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <WalletCard item={item} />}
    />
  );
}
