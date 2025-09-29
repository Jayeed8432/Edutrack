import { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FaceAttendanceProps {
  onImageCaptured: (file: File) => void;
}

export function FaceAttendanceCapture({ onImageCaptured }: FaceAttendanceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageCaptured(file);
    }
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          setPreview(URL.createObjectURL(blob));
          onImageCaptured(file);
        }
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Face Recognition Attendance</CardTitle>
        <CardDescription>Upload a classroom photo or use your camera to mark attendance using face recognition.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap">
          <Button onClick={() => fileInputRef.current?.click()} type="button">
            Upload Photo
          </Button>
          <Button onClick={startCamera} type="button" disabled={streaming}>
            Start Camera
          </Button>
          {streaming && (
            <Button onClick={capturePhoto} type="button">
              Capture Photo
            </Button>
          )}
          {streaming && (
            <Button onClick={stopCamera} type="button" variant="destructive">
              Stop Camera
            </Button>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {streaming && (
          <div className="mt-4">
            <video ref={videoRef} autoPlay className="max-h-64 rounded border" />
          </div>
        )}
        {preview && !streaming && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="max-h-64 rounded border" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
