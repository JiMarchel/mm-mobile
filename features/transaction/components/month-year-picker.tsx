import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import { setMonth, setYear } from 'date-fns';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthYearPicker({
    value,
    onChange,
    open,
    onOpenChange
}: {
    value: Date;
    onChange: (date: Date) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { colorScheme } = useColorScheme();
    const theme = NAV_THEME[colorScheme ?? 'light'];
    
    const [tempYear, setTempYear] = useState(value.getFullYear());

    useEffect(() => {
        if (open) {
            setTempYear(value.getFullYear());
        }
    }, [open, value]);

    const handleMonthSelect = (monthIndex: number) => {
        let newDate = setYear(value, tempYear);
        newDate = setMonth(newDate, monthIndex);
        onChange(newDate);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[320px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Select Month</DialogTitle>
                </DialogHeader>
                
                {/* Year Selector */}
                <View className="flex-row items-center justify-between mt-2 mb-6 px-4">
                    <TouchableOpacity onPress={() => setTempYear(y => y - 1)} className="p-2 bg-secondary/50 rounded-full">
                        <ChevronLeft color={theme.colors.text} size={20} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-foreground">{tempYear}</Text>
                    <TouchableOpacity onPress={() => setTempYear(y => y + 1)} className="p-2 bg-secondary/50 rounded-full">
                        <ChevronRight color={theme.colors.text} size={20} />
                    </TouchableOpacity>
                </View>

                {/* Months Grid */}
                <View className="flex-row flex-wrap justify-between px-2 pb-2 gap-y-4">
                    {MONTHS.map((month, index) => {
                        const isSelected = value.getMonth() === index && value.getFullYear() === tempYear;
                        return (
                            <TouchableOpacity
                                key={month}
                                onPress={() => handleMonthSelect(index)}
                                className={`w-[30%] py-3 items-center justify-center rounded-xl border ${
                                    isSelected 
                                        ? 'bg-primary border-primary' 
                                        : 'bg-card border-border'
                                }`}
                            >
                                <Text className={`font-medium ${isSelected ? 'text-primary-foreground font-bold' : 'text-foreground'}`}>
                                    {month}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </DialogContent>
        </Dialog>
    );
}
