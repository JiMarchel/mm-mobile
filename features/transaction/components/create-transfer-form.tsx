import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner-native';
import { useCreateTransfer } from '../hooks/use-create-transfer';
import { createTransferSchema } from '../validation/transaction';
import { CreateTransferPayload } from '../type';
import { extractErrorMessage } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAllWallets } from '@/features/wallet/hooks/use-all-wallets';

export function CreateTransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const mutation = useCreateTransfer();
  const insets = useSafeAreaInsets();
  const { data: walletsData } = useAllWallets();

  const wallets = walletsData?.data || [];

  const form = useForm({
    defaultValues: {
      sourceAccountId: '',
      destinationAccountId: '',
      amount: '' as unknown as number,
      description: '',
      date: new Date().toISOString(),
    } as unknown as CreateTransferPayload,
    validators: {
      onSubmit: createTransferSchema as any,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          toast.success('Transfer created successfully.');
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error, 'Failed to create transfer.'));
        },
      });
    },
  });

  return (
    <View className="gap-4 w-full">
      <form.Field
        name="sourceAccountId"
        children={(field) => (
          <View className="gap-1.5 z-50">
            <Label htmlFor={field.name}>Source Account</Label>
            <Select
              value={field.state.value ? { value: field.state.value, label: wallets.find(w => w.id === field.state.value)?.name || field.state.value } : undefined}
              onValueChange={(option) => {
                if (option) field.handleChange(option.value);
              }}>
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm"
                  placeholder="Select source account"
                />
              </SelectTrigger>
              <SelectContent insets={insets} className="w-[300px]">
                <SelectGroup>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} label={wallet.name} value={wallet.id}>
                      <Text>{wallet.name}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <Text className="text-sm text-destructive">
                {field.state.meta.errors.map((err: any) => (typeof err === 'object' ? err.message : err)).join(', ')}
              </Text>
            )}
          </View>
        )}
      />

      <form.Field
        name="destinationAccountId"
        children={(field) => (
          <View className="gap-1.5 z-40">
            <Label htmlFor={field.name}>Destination Account</Label>
            <Select
              value={field.state.value ? { value: field.state.value, label: wallets.find(w => w.id === field.state.value)?.name || field.state.value } : undefined}
              onValueChange={(option) => {
                if (option) field.handleChange(option.value);
              }}>
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm"
                  placeholder="Select destination account"
                />
              </SelectTrigger>
              <SelectContent insets={insets} className="w-[300px]">
                <SelectGroup>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} label={wallet.name} value={wallet.id}>
                      <Text>{wallet.name}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <Text className="text-sm text-destructive">
                {field.state.meta.errors.map((err: any) => (typeof err === 'object' ? err.message : err)).join(', ')}
              </Text>
            )}
          </View>
        )}
      />

      <form.Field
        name="amount"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Amount</Label>
            <Input
              id={field.name}
              placeholder="e.g. 50000"
              value={field.state.value?.toString() || ''}
              onChangeText={(text) => field.handleChange(text as unknown as number)}
              onBlur={field.handleBlur}
              keyboardType="numeric"
              returnKeyType="done"
            />
            {field.state.meta.errors.length > 0 && (
              <Text className="text-sm text-destructive">
                {field.state.meta.errors.map((err: any) => (typeof err === 'object' ? err.message : err)).join(', ')}
              </Text>
            )}
          </View>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Description</Label>
            <Input
              id={field.name}
              placeholder="What was this for?"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              returnKeyType="done"
            />
            {field.state.meta.errors.length > 0 && (
              <Text className="text-sm text-destructive">
                {field.state.meta.errors.map((err: any) => (typeof err === 'object' ? err.message : err)).join(', ')}
              </Text>
            )}
          </View>
        )}
      />

      {mutation.isError && (
        <Text className="text-center text-sm text-destructive">
          {extractErrorMessage(mutation.error, 'Failed to create transfer.')}
        </Text>
      )}

      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            onPress={form.handleSubmit}
            disabled={mutation.isPending}
            className="mt-4 flex-row items-center justify-center gap-2">
            {(isSubmitting || mutation.isPending) && <ActivityIndicator color="#000" />}
            <Text>{isSubmitting || mutation.isPending ? 'Saving...' : 'Save Transfer'}</Text>
          </Button>
        )}
      />
    </View>
  );
}
