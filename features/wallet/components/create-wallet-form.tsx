import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner-native';
import { useCreateWallet } from '../hooks/use-create-wallet';
import { createWalletSchema, CreateWalletInput } from '../validation/wallet';
import { ACCOUNT_TYPES, AccountType } from '../type';
import { extractErrorMessage } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Banknote, Building2, CreditCard, PiggyBank, 
  TrendingUp, Smartphone, Bitcoin, HandCoins, LucideIcon 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ACCOUNT_TYPE_ICONS: Record<AccountType, LucideIcon> = {
  'Cash': Banknote,
  'Bank': Building2,
  'Credit Card': CreditCard,
  'Savings': PiggyBank,
  'Investment': TrendingUp,
  'E-Wallet': Smartphone,
  'Crypto': Bitcoin,
  'Loan': HandCoins
};

export function CreateWalletForm({ onSuccess }: { onSuccess?: () => void }) {
  const mutation = useCreateWallet();
  const insets = useSafeAreaInsets();

  const form = useForm({
    defaultValues: {
      name: '',
      accountType: '' as AccountType,
      currency: 'IDR',
    } as CreateWalletInput,
    validators: {
      onSubmit: createWalletSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value, {
        onSuccess: (data) => {
          toast.success('Wallet created successfully.');
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error, 'Failed to create wallet.'));
        },
      });
    },
  });

  return (
    <View className="gap-4 w-full">
      <form.Field
        name="name"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Wallet Name</Label>
            <Input
              id={field.name}
              placeholder="e.g. Main Bank Account"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              returnKeyType="next"
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
        name="accountType"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Account Type</Label>
            <Select
              value={field.state.value ? { value: field.state.value, label: field.state.value } : undefined}
              onValueChange={(option) => {
                if (option) field.handleChange(option.value as AccountType);
              }}>
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm"
                  placeholder="Select account type"
                />
              </SelectTrigger>
              <SelectContent insets={insets} className="w-[250px]">
                <SelectGroup>
                  {ACCOUNT_TYPES.map((type) => {
                    const IconComponent = ACCOUNT_TYPE_ICONS[type];
                    return (
                      <SelectItem key={type} label={type} value={type}>
                        <View className="flex-row items-center gap-2">
                          <IconComponent size={16} className="text-muted-foreground" />
                          <Text>{type}</Text>
                        </View>
                      </SelectItem>
                    );
                  })}
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
        name="currency"
        children={(field) => (
          <View className="gap-1.5">
            <Label htmlFor={field.name}>Currency</Label>
            <Input
              id={field.name}
              placeholder="e.g. IDR, USD"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text.toUpperCase())}
              onBlur={field.handleBlur}
              maxLength={3}
              autoCapitalize="characters"
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
          {extractErrorMessage(mutation.error, 'Failed to create wallet.')}
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
            <Text>{isSubmitting || mutation.isPending ? 'Saving...' : 'Create Wallet'}</Text>
          </Button>
        )}
      />
    </View>
  );
}
