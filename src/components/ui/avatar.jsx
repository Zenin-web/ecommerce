import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({ className, src, alt = "", fallback = "", ...props }) {
  const [failedSrc, setFailedSrc] = React.useState(null);

  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      {src && src !== failedSrc ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}

export { Avatar };
