import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner-native';
import { useCreateCategory } from '../hooks/use-create-category';
import { createCategorySchema, CreateCategoryInput } from '../validation/category';
import { CategoryType } from '../type';
import { extractErrorMessage } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function CreateCategoryDialog({ 
  open, 
  onOpenChange, 
  defaultType = 'Income',
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  defaultType?: CategoryType;
  onSuccess?: () => void;
}) {
  const mutation = useCreateCategory();

  const form = useForm({
    defaultValues: {
      name: '',
      type: defaultType,
    } as CreateCategoryInput,
    validators: {
      onSubmit: createCategorySchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          toast.success('Category created successfully.');
          form.reset();
          onSuccess?.();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error, 'Failed to create category.'));
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <View className="gap-4 w-full mt-4">
          <form.Field
            name="name"
            children={(field) => (
              <View className="gap-1.5">
                <Label htmlFor={field.name}>Category Name</Label>
                <Input
                  id={field.name}
                  placeholder="e.g. Salary, Food"
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

          <View className="gap-1.5">
            <Label>Type</Label>
            <Input
              value={defaultType}
              editable={false}
              className="bg-muted text-muted-foreground"
            />
          </View>

          {mutation.isError && (
            <Text className="text-center text-sm text-destructive">
              {extractErrorMessage(mutation.error, 'Failed to create category.')}
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
                <Text>{isSubmitting || mutation.isPending ? 'Saving...' : 'Create Category'}</Text>
              </Button>
            )}
          />
        </View>
      </DialogContent>
    </Dialog>
  );
}
