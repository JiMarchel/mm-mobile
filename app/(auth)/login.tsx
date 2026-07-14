import { StackScreen } from '@/components/stack-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

export default function LoginPage() {
  const router = useRouter();
  return (
    <View className="m-6 flex-1 justify-center">
      <StackScreen />
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Welcome back! Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="next"
                submitBehavior="submit"
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}>
                  <Text className="font-normal leading-4">Forgot your password?</Text>
                </Button>
              </View>
              <Input id="password" secureTextEntry returnKeyType="send" placeholder="********" />
            </View>
            <Button className="w-full">
              <Text>Continue</Text>
            </Button>
          </View>
          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-center text-sm">Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/register')}>
              <Text className="text-sm underline underline-offset-4">Sign Up</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
