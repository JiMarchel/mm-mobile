import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useForm } from '@tanstack/react-form';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { useLogin } from '../hooks/use-login';
import { loginSchema } from '../validation/login';
import { saveTokens } from '@/infrastructure/storage/token';
import { deviceName } from 'expo-device';
import { useAuth } from '../context/auth-context';

export function LoginForm() {
    const mutation = useLogin();
    const router = useRouter();
    const { setToken } = useAuth();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            deviceName: deviceName || "Unknown"
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: ({ value }) => {
            mutation.mutate(value, {
                onSuccess: async (data) => {
                    await saveTokens(data.data!.accessToken, data.data!.refreshToken);
                    setToken(data.data!.accessToken);
                    // router.replace is now handled globally by AuthGuard, but we can keep it as fallback
                    router.replace('/(protected)/transaction');
                    toast.success(data.message || 'Login success.');
                },
                onError: (error) => {
                    toast.error(error.message || 'Terjadi kesalahan saat login.');
                    console.error('Login error:', error);
                },
            });
        },
    });


    return (
        <>
            <form.Field
                name="email"
                children={(field) => (
                    <View className="gap-1.5">
                        <Label htmlFor={field.name}>Email</Label>
                        <Input
                            id={field.name}
                            placeholder="m@example.com"
                            keyboardType="email-address"
                            autoComplete="email"
                            autoCapitalize="none"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            returnKeyType="next"
                        />
                        {field.state.meta.errors.length > 0 && (
                            <Text className="text-sm text-destructive">
                                {field.state.meta.errors
                                    .map((err: any) => (typeof err === 'object' ? err.message : err))
                                    .join(', ')}
                            </Text>
                        )}
                    </View>
                )}
            />
            <form.Field
                name="password"
                children={(field) => (
                    <View className="gap-1.5">
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                            id={field.name}
                            secureTextEntry
                            placeholder="********"
                            value={field.state.value}
                            onChangeText={field.handleChange}
                            onBlur={field.handleBlur}
                            returnKeyType="next"
                        />
                        {field.state.meta.errors.length > 0 && (
                            <Text className="text-sm text-destructive">
                                {field.state.meta.errors
                                    .map((err: any) => (typeof err === 'object' ? err.message : err))
                                    .join(', ')}
                            </Text>
                        )}
                    </View>
                )}
            />

            {mutation.isError && (
                <Text className="text-center text-sm text-destructive">
                    {mutation.error.message || 'Terjadi kesalahan saat login.'}
                </Text>
            )}

            <form.Subscribe
                selector={(state) => [state.isSubmitting]}
                children={([isSubmitting]) => (
                    <Button
                        onPress={form.handleSubmit}
                        disabled={mutation.isPending}
                        className="w-full flex-row items-center justify-center gap-2">
                        {(isSubmitting || mutation.isPending) && <ActivityIndicator color="#000" />}
                        <Text>{isSubmitting || mutation.isPending ? 'Processing...' : 'Continue'}</Text>
                    </Button>
                )}
            />
        </>
    );
}
