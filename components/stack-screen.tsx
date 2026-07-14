import { Stack } from 'expo-router';
import { ThemeToggle } from './theme-toggle';

type StackScreenProps = React.ComponentProps<typeof Stack.Screen>;

export function StackScreen({ options, ...props }: StackScreenProps) {
  return (
    <Stack.Screen
      {...props}
      options={{
        ...options,
        headerRight: () => <ThemeToggle />,
      }}
    />
  );
}
