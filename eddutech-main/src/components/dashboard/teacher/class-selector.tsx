'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { mockClasses } from '@/lib/data';
import type { Dispatch, SetStateAction } from 'react';
  
interface ClassSelectorProps {
    selectedClassId: string;
    setSelectedClassId: Dispatch<SetStateAction<string>>;
}

export function ClassSelector({ selectedClassId, setSelectedClassId }: ClassSelectorProps) {
    return (
        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
            {mockClasses.map((cls) => (
                <SelectItem key={cls.classId} value={cls.classId}>
                {cls.subject}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
    );
}
