import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { TabType, TransactionTabs } from '../components/transaction-tabs';
import { CreateTransactionForm } from '../components/create-transaction-form';
import { CreateTransferForm } from '../components/create-transfer-form';
import { useLocalSearchParams, useRouter } from 'expo-router';

export function CreateTransactionScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Income');
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const initialDate = params.date ? params.date : undefined;

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
        {activeTab === 'Income' && <CreateTransactionForm direction="IN" initialDate={initialDate} />}
        {activeTab === 'Expense' && <CreateTransactionForm direction="OUT" initialDate={initialDate} />}
        {activeTab === 'Transfer' && <CreateTransferForm initialDate={initialDate} />}
      </ScrollView>
    </View>
  );
}
