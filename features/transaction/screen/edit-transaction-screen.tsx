import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { CreateTransactionForm } from '../components/create-transaction-form';
import { CreateTransferForm } from '../components/create-transfer-form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetTransaction } from '../hooks/use-get-transaction';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react-native';

export function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: transactionData, isLoading, isError, refetch } = useGetTransaction(id as string);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !transactionData?.data) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Text className="text-destructive mb-4">Failed to load transaction data.</Text>
        <Button onPress={() => refetch()}><Text>Retry</Text></Button>
      </View>
    );
  }

  const transaction = transactionData.data;

  // Determine if it's a transfer
  const isTransfer = transaction.entries.length > 1;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center p-4 border-b border-border">
        <Button variant="ghost" size="icon" onPress={() => router.back()} className="mr-2">
            <ChevronLeft size={24} color="gray" />
        </Button>
        <Text className="text-xl font-bold">
            Edit {isTransfer ? 'Transfer' : 'Transaction'}
        </Text>
      </View>
      
      <ScrollView 
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isTransfer ? (
            <CreateTransferForm 
                isEditing
                transactionId={transaction.id}
                initialData={{
                    sourceAccountId: transaction.entries.find(e => e.direction === 'OUT')?.accountId || '',
                    destinationAccountId: transaction.entries.find(e => e.direction === 'IN')?.accountId || '',
                    amount: transaction.entries[0]?.amount,
                    description: transaction.description,
                    date: transaction.date,
                }}
                onSuccess={() => router.back()}
            />
        ) : (
            <CreateTransactionForm 
                isEditing
                transactionId={transaction.id}
                direction={transaction.entries[0]?.direction || 'OUT'}
                initialData={{
                    accountId: transaction.entries[0]?.accountId || '',
                    categoryId: transaction.entries[0]?.categoryId || '',
                    amount: transaction.entries[0]?.amount,
                    description: transaction.description,
                    date: transaction.date,
                    direction: transaction.entries[0]?.direction || 'OUT',
                }}
                onSuccess={() => router.back()}
            />
        )}
      </ScrollView>
    </View>
  );
}
