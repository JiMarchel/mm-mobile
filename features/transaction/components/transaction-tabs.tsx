import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

export type TabType = 'Income' | 'Expense' | 'Transfer';

export function TransactionTabs({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: TabType; 
  onTabChange: (tab: TabType) => void;
}) {
  const tabs: TabType[] = ['Income', 'Expense', 'Transfer'];

  return (
    <View className="flex-row items-center border border-border rounded-lg overflow-hidden">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            className={`flex-1 py-3 items-center justify-center ${isActive ? 'bg-primary' : 'bg-transparent'} ${index !== tabs.length - 1 ? 'border-r border-border' : ''}`}
          >
            <Text className={`font-medium ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
