export interface VehicleItemsProps {
  standardItems?: Array<{ name: string; category: string }>;
  optionalItems?: Array<{ name: string; category: string }>;
  className?: string;
}
