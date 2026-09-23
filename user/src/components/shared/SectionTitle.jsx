import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function SectionTitle({ title, viewAllLink }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center text-sm font-medium text-primary hover:underline"
        >
          Barchasi
          <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
