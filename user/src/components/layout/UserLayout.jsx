import { Outlet } from "react-router-dom";
import { UserHeader } from "./UserHeader";
import { UserFooter } from "./UserFooter";

export function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}
