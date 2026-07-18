import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

export type ViewTabType = 'Daily' | 'Calendar' | 'Monthly' | 'Total' | 'Note';

export function TransactionViewTabs({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: ViewTabType; 
  onTabChange: (tab: ViewTabType) => void;
}) {
  const tabs: ViewTabType[] = ['Daily', 'Calendar', 'Monthly', 'Total', 'Note'];

  return (
    <View className="border-b border-border bg-card">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View className="flex-row">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => onTabChange(tab)}
                className={`py-3 px-4 mr-2 ${isActive ? 'border-b-2 border-primary' : ''}`}
              >
                <Text className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
