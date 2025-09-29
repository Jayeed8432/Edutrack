import { GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center">
        <GraduationCap className="h-6 w-6 text-primary" />
        <Sparkles className="relative right-2 top-2 h-4 w-4 text-accent" />
      </div>
      <h1 className="text-xl font-bold font-headline text-foreground">
        EduProductivity Hub
      </h1>
    </div>
  );
}
