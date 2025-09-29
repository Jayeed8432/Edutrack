'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw } from 'lucide-react';
import { mockClasses } from '@/lib/data';

interface QrCodeDisplayProps {
    classId: string;
}

export function QrCodeDisplay({ classId }: QrCodeDisplayProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const selectedClass = mockClasses.find(c => c.classId === classId);

    const generateQrCode = () => {
        if (!selectedClass) return;
        const data = JSON.stringify({ classId: selectedClass.classId, timestamp: new Date().toISOString() });
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`;
        setQrCodeUrl(url);
    }
    
    useEffect(() => {
        // Only generate QR code on client to avoid hydration mismatch
        if (typeof window !== 'undefined') {
            generateQrCode();
        }
    }, [classId]);


    if (!selectedClass) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><QrCode /> Attendance QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Please select a class to generate a QR code.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><QrCode /> Attendance QR Code</CardTitle>
                <CardDescription>Students can scan this code to mark their attendance for {selectedClass.subject}.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-6">
                {qrCodeUrl ? (
                <Image
                    src={qrCodeUrl}
                    alt="Attendance QR Code"
                    width={250}
                    height={250}
                    className="rounded-lg border"
                    data-ai-hint="QR code"
                />
                ) : (
                <div className="w-[250px] h-[250px] bg-muted rounded-lg flex items-center justify-center">
                    <p>Loading QR Code...</p>
                </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={generateQrCode}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Code
                </Button>
            </CardFooter>
        </Card>
    );
}
