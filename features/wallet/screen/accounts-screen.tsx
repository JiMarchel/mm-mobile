import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateWalletForm } from '../components/create-wallet-form';
import { WalletList } from '../components/wallet-list';

export function AccountsScreen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <View className="flex-1 p-6">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold">Wallets</Text>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className="rounded-full h-12 w-12 shadow-md">
              <Plus color="black" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Wallet</DialogTitle>
            </DialogHeader>
            <CreateWalletForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </View>

      <WalletList />
    </View>
  );
}
