import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useForm } from '@tanstack/react-form';
import { ActivityIndicator, View } from 'react-native';
import { useRegister } from '../hooks/use-register';
import { registerSchema } from '../validation/register';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

export function RegisterForm() {
  const mutation = useRegister();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...data } = value;

      mutation.mutate(data, {
        onSuccess: (data) => {
          router.replace('/(auth)/login');
          toast.success(data.message || 'Registration success.');
        },
        onError: (error) => {
          toast.error(error.message || 'Terjadi kesalahan saat mendaftar.');
          console.error('Registration error:', error);
        },
      });
    },
  });

  return (
    <>
      <form.Field
        name="username"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Username</Label>
            <Input
              id={field.name}
              placeholder="Masukkan username"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="none"
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
      <form.Field
        name="confirmPassword"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Confirm Password</Label>
            <Input
              id={field.name}
              secureTextEntry
              placeholder="********"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              returnKeyType="send"
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
          {mutation.error.message || 'Terjadi kesalahan saat mendaftar.'}
        </Text>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
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
