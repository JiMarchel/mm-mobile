import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Wallet } from '../type';
import { ACCOUNT_TYPE_ICONS } from './create-wallet-form';

export function WalletCard({ item }: { item: Wallet }) {
  const IconComponent = ACCOUNT_TYPE_ICONS[item.accountType as keyof typeof ACCOUNT_TYPE_ICONS] || ACCOUNT_TYPE_ICONS['Cash'];
  
  return (
    <Card className="flex-row items-center justify-between p-4">
      <View className="flex-row items-center gap-3">
        <View className="bg-primary p-3 rounded-full">
          <IconComponent size={20} />
        </View>
        <View>
          <Text className="text-base font-semibold">{item.name}</Text>
          <Text className="text-xs font-medium text-muted-foreground">
            {item.accountType}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-bold">
          {item.currency} {parseFloat(item.balance).toLocaleString('id-ID')}
        </Text>
      </View>
    </Card>
  );
}
