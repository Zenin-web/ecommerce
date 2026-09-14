import { Navigate } from "react-router-dom";
import { useMeQuery } from "@/store/api/authApi";
import { clearToken, getToken } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedRoute({ children }) {
  const token = getToken();
  const { isLoading, isError } = useMeQuery(undefined, { skip: !token });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (isError) {
    clearToken();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const token = getToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
