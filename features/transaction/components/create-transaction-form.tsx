import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner-native';
import { useCreateTransaction } from '../hooks/use-create-transaction';
import { useUpdateTransaction } from '../hooks/use-update-transaction';
import { createTransactionSchema, CreateTransactionInput } from '../validation/transaction';
import { Transaction } from '../type';
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
import { useGetCategories } from '@/features/category/hooks/use-get-categories';
import { TransactionDirection } from '../type';
import { CreateCategoryDialog } from '@/features/category/components/create-category-dialog';
import { Plus } from 'lucide-react-native';

export function CreateTransactionForm({ 
  direction, 
  onSuccess,
  initialDate,
  isEditing = false,
  transactionId,
  initialData,
}: { 
  direction: TransactionDirection;
  onSuccess?: () => void;
  initialDate?: string;
  isEditing?: boolean;
  transactionId?: string;
  initialData?: Partial<CreateTransactionInput>;
}) {
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction(transactionId || '');
  const mutation = isEditing ? updateMutation : createMutation;
  const insets = useSafeAreaInsets();
  const { data: walletsData } = useAllWallets();
  const { data: categoriesData } = useGetCategories();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const wallets = walletsData?.data || [];
  const categoryType = direction === 'IN' ? 'Income' : 'Expense';
  const categories = (categoriesData?.data || []).filter(c => c.type === categoryType);

  const form = useForm({
    defaultValues: {
      accountId: initialData?.accountId || '',
      categoryId: initialData?.categoryId || '',
      amount: (initialData?.amount?.toString() || '') as unknown as number,
      direction,
      description: initialData?.description || '',
      date: initialData?.date 
        ? new Date(initialData.date).toISOString() 
        : (initialDate ? new Date(`${initialDate}T12:00:00Z`).toISOString() : new Date().toISOString()),
    } as unknown as CreateTransactionInput, // Cast due to amount being typed as number in schema
    validators: {
      onSubmit: createTransactionSchema as any,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          toast.success(`Transaction ${isEditing ? 'updated' : 'created'} successfully.`);
          if (!isEditing) form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error, `Failed to ${isEditing ? 'update' : 'create'} transaction.`));
        },
      });
    },
  });

  return (
    <View className="gap-4 w-full">
      <form.Field
        name="accountId"
        children={(field) => (
          <View className="gap-1.5 z-50">
            <Label htmlFor={field.name}>Account / Wallet</Label>
            <Select
              value={field.state.value ? { value: field.state.value, label: wallets.find(w => w.id === field.state.value)?.name || field.state.value } : undefined}
              onValueChange={(option) => {
                if (option) field.handleChange(option.value);
              }}>
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm"
                  placeholder="Select account"
                />
              </SelectTrigger>
              <SelectContent insets={insets} className="w-[350px]">
                <SelectGroup>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} label={wallet.name} value={wallet.id}>
                      <View className="flex-row items-center justify-between w-full pr-8">
                        <Text>{wallet.name}</Text>
                        <Text className="text-muted-foreground text-xs ml-4">
                          Rp {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(Number(wallet.balance) || 0)}
                        </Text>
                      </View>
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
        name="categoryId"
        children={(field) => (
          <View className="gap-1.5 z-40">
            <Label htmlFor={field.name}>Category</Label>
            <Select
              value={field.state.value ? { value: field.state.value, label: categories.find(c => c.id === field.state.value)?.name || field.state.value } : undefined}
              onValueChange={(option) => {
                if (option && option.value === 'NEW_CATEGORY') {
                  setTimeout(() => setIsCategoryDialogOpen(true), 150);
                  return;
                }
                if (option) field.handleChange(option.value);
              }}>
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm"
                  placeholder="Select category"
                />
              </SelectTrigger>
              <SelectContent insets={insets} className="w-[350px]">
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} label={category.name} value={category.id}>
                      <Text>{category.name}</Text>
                    </SelectItem>
                  ))}
                  <SelectItem key="new-category" label="Create New Category" value="NEW_CATEGORY" className="mt-1 border-t border-border pt-2">
                    <View className="flex-row items-center gap-2">
                      <Plus size={16} className="text-muted-foreground" />
                      <Text className="text-sm font-medium">Create New Category</Text>
                    </View>
                  </SelectItem>
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
          {extractErrorMessage(mutation.error, `Failed to ${isEditing ? 'update' : 'create'} transaction.`)}
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
            <Text>{isSubmitting || mutation.isPending ? 'Saving...' : (isEditing ? 'Update Transaction' : 'Save Transaction')}</Text>
          </Button>
        )}
      />

      <CreateCategoryDialog 
        open={isCategoryDialogOpen} 
        onOpenChange={setIsCategoryDialogOpen}
        defaultType={categoryType} 
      />
    </View>
  );
}
