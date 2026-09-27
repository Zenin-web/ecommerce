import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {Icon && <Icon className="size-12 text-muted-foreground/40" />}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {actionLabel && actionLink && (
        <Button asChild className="mt-2">
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
