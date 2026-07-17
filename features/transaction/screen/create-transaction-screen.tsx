import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { TabType, TransactionTabs } from '../components/transaction-tabs';
import { CreateTransactionForm } from '../components/create-transaction-form';
import { CreateTransferForm } from '../components/create-transfer-form';
import { useRouter } from 'expo-router';

export function CreateTransactionScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Income');
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to the transaction list when done
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-6 pb-2">
        <TransactionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
      
      <ScrollView 
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Income' && <CreateTransactionForm direction="IN" onSuccess={handleSuccess} />}
        {activeTab === 'Expense' && <CreateTransactionForm direction="OUT" onSuccess={handleSuccess} />}
        {activeTab === 'Transfer' && <CreateTransferForm onSuccess={handleSuccess} />}
      </ScrollView>
    </View>
  );
}
