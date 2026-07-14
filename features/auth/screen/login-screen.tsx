import { StackScreen } from '@/components/stack-screen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { LoginForm } from '../components/login-form';

export const LoginScreen = () => {
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
                        <LoginForm />
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
    )
}