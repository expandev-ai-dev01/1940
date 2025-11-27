import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { VehicleShareProps } from './types';

function VehicleShare({ vehicle, className }: VehicleShareProps) {
  const shareUrl = window.location.href;
  const shareText = `Confira este ${vehicle.brand} ${vehicle.model} ${
    vehicle.year
  } por ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    vehicle.price
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copiado para a área de transferência');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.brand} ${vehicle.model}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-muted-foreground text-sm font-medium">Compartilhar:</span>
      <Button variant="ghost" size="icon-sm" onClick={handleShare} title="Compartilhar">
        <Share2 className="h-4 w-4" />
      </Button>
      <div className="bg-border mx-1 h-4 w-px" />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          )
        }
        title="Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareText
            )}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          )
        }
        title="Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={handleCopyLink} title="Copiar Link">
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { VehicleShare };
