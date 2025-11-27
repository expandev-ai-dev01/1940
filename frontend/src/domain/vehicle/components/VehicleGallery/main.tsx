import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/core/components/dialog';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VehicleGalleryProps } from './types';

function VehicleGallery({ images, mainImage, title, className }: VehicleGalleryProps) {
  const allImages = [mainImage, ...(images || [])].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  if (allImages.length === 0) {
    return (
      <div
        className={cn(
          'bg-muted flex aspect-video w-full items-center justify-center rounded-lg',
          className
        )}
      >
        <span className="text-muted-foreground">Sem imagens disponíveis</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="bg-muted relative overflow-hidden rounded-xl border">
        <div className="aspect-video w-full">
          <img
            src={allImages[selectedIndex]}
            alt={`${title} - Foto ${selectedIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 transition-opacity hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePrevious}
            className="h-10 w-10 rounded-full shadow-md"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleNext}
            className="h-10 w-10 rounded-full shadow-md"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-md"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
            <div className="relative flex h-[80vh] w-full items-center justify-center">
              <img
                src={allImages[selectedIndex]}
                alt={`${title} - Ampliada`}
                className="max-h-full max-w-full object-contain"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all',
              selectedIndex === index
                ? 'border-primary ring-primary/20 ring-2'
                : 'border-transparent opacity-70 hover:opacity-100'
            )}
          >
            <img
              src={image}
              alt={`Miniatura ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export { VehicleGallery };
