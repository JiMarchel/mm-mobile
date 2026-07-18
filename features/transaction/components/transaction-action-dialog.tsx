import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FlatTransaction } from '../type';
import { Edit2, Trash2 } from 'lucide-react-native';
import { useDeleteTransaction } from '../hooks/use-delete-transaction';
import { extractErrorMessage } from '@/lib/utils';
import { toast } from 'sonner-native';

export function TransactionActionDialog({
    transaction,
    open,
    onOpenChange,
    onEdit
}: {
    transaction: FlatTransaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (transaction: FlatTransaction) => void;
}) {
    const deleteMutation = useDeleteTransaction();
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDelete = () => {
        if (!transaction) return;
        deleteMutation.mutate(transaction.transactionId, {
            onSuccess: () => {
                toast.success('Transaction deleted successfully');
                setIsConfirmingDelete(false);
                onOpenChange(false);
            },
            onError: (err) => {
                toast.error(extractErrorMessage(err, 'Failed to delete transaction'));
            }
        });
    };

    if (!transaction) return null;

    if (isConfirmingDelete) {
        return (
            <Dialog open={open} onOpenChange={(val) => {
                if (!val) setIsConfirmingDelete(false);
                onOpenChange(val);
            }}>
                <DialogContent className="p-4">
                    <View style={{ width: 320, maxWidth: '100%' }}>
                        <DialogHeader>
                            <DialogTitle>Delete Transaction</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this transaction? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <View className="flex-row justify-end gap-2 mt-4">
                            <Button variant="ghost" onPress={() => setIsConfirmingDelete(false)} disabled={deleteMutation.isPending}>
                                <Text>Cancel</Text>
                            </Button>
                            <Button variant="destructive" onPress={handleDelete} disabled={deleteMutation.isPending} className="flex-row gap-2">
                                {deleteMutation.isPending && <ActivityIndicator color="#fff" size="small" />}
                                <Text>Delete</Text>
                            </Button>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-2 border-0">
                <View style={{ width: 320, maxWidth: '100%' }}>
                    <View className="p-4 border-b border-border/50 pb-4 mb-2">
                        <Text className="text-lg font-semibold text-center">{transaction.description}</Text>
                        <Text className="text-sm text-muted-foreground text-center mt-1">
                            Rp {new Intl.NumberFormat('id-ID').format(transaction.amount)}
                        </Text>
                    </View>
                    <View className="px-2 pb-2 gap-2">
                        <TouchableOpacity 
                            className="flex-row items-center p-3 rounded-lg bg-secondary/30"
                            onPress={() => {
                                onOpenChange(false);
                                onEdit(transaction);
                            }}
                        >
                            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-4">
                                <Edit2 size={20} className="text-primary" />
                            </View>
                            <Text className="text-base font-medium flex-1 text-foreground">Edit Transaction</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            className="flex-row items-center p-3 rounded-lg bg-destructive/10"
                            onPress={() => setIsConfirmingDelete(true)}
                        >
                            <View className="w-10 h-10 rounded-full bg-destructive items-center justify-center mr-4">
                                <Trash2 size={20} className="text-destructive" />
                            </View>
                            <Text className="text-base font-medium flex-1 text-destructive">Delete Transaction</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </DialogContent>
        </Dialog>
    );
}
