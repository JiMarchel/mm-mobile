import { StackScreen } from '@/components/stack-screen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { RegisterForm } from '../components/register-form';

export function RegisterScreen() {
  const router = useRouter();
  return (
    <View className="m-6 flex-1 justify-center">
      <StackScreen />
      <Card>
        <CardHeader>
          <CardTitle>Create your account.</CardTitle>
          <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="gap-6">
            <RegisterForm />
          </View>
          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-center text-sm">Already have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text className="text-sm underline underline-offset-4">Sign In</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
