import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { LogOut } from 'lucide-react-native';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { getRefreshToken } from '@/infrastructure/storage/token';
import { toast } from 'sonner-native';
import { extractErrorMessage } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

export default function MoreScreen() {
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      toast.error('Invalid session.');
      return;
    }

    logoutMutation.mutate(
      { refreshToken },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('Successfully logged out.');
        },
        onError: (error) => {
          toast.error(extractErrorMessage(error, 'Failed to logout.'));
        },
      }
    );
  };

  return (
    <View className="flex-1 p-6 gap-6">
      <View className="gap-2">
        <Text className="text-xl font-semibold">Settings</Text>
        <Text className="text-sm text-muted-foreground">Manage your account and application here.</Text>
      </View>

      <Button variant="destructive" className="flex-row items-center gap-2 mt-auto" onPress={() => setIsOpen(true)}>
        <LogOut size={18} color="white" />
        <Text className="text-white font-medium">Logout</Text>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to log in again to access your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={logoutMutation.isPending}>
                <Text>Cancel</Text>
              </Button>
            </DialogClose>
            <Button variant="destructive" onPress={handleLogout} disabled={logoutMutation.isPending}>
              {logoutMutation.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white">Yes, Log out</Text>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
