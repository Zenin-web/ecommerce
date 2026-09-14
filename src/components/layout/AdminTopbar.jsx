import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMeQuery } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi/baseApi";
import { clearToken } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils";
import { useDispatch } from "react-redux";

export function AdminTopbar({ title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: meResponse } = useMeQuery();
  const user = meResponse?.user || meResponse?.data || meResponse;

  const profileImg = user?.profileImg || user?.profileImage || user?.avatar;
  const avatarSrc = getImageUrl(profileImg);
  const fallback = user?.name?.charAt(0)?.toUpperCase() || "A";

  const handleLogout = () => {
    clearToken();
    dispatch(baseApi.util.resetApiState());
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-secondary"
            >
              <Avatar src={avatarSrc} fallback={fallback} />
              <div className="hidden text-left text-sm sm:block">
                <p className="font-medium leading-none">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="size-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="size-4" />
              Chiqish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
