import { Tabs } from 'expo-router';
import { ArrowRightLeft, PieChart, Wallet, Menu } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ProtectedLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerRight: () => <ThemeToggle />,
      }}>
      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => (
            <ArrowRightLeft size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistic"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <PieChart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, size }) => (
            <Wallet size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Menu size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
