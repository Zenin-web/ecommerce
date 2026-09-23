import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantityInput({ value = 1, onChange }) {
  return (
    <div className="inline-flex items-center rounded-md border">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-r-none"
        onClick={() => onChange?.(Math.max(1, value - 1))}
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-l-none"
        onClick={() => onChange?.(value + 1)}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
