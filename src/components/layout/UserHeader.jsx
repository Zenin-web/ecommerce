import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingCart,
  User,
  Menu,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi/categoryApi";
import { useGetMyCartQuery } from "@/store/api/cartApi/cartApi";
import { useAuth, clearToken } from "@/hooks/useAuth";
export function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const categories = categoriesResponse?.data || [];
  const { data: cartResponse } = useGetMyCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartItems = cartResponse?.data?.items || [];
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const handleLogout = () => {
    clearToken();
    navigate("/");
  };
  const currentCategory = new URLSearchParams(location.search).get("category");
  const isCatalogPage = location.pathname === "/catalog";
  const isAllCategoriesActive = isCatalogPage && !currentCategory;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {" "}
      {/* TOP */}{" "}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6">
        {" "}
        {/* LOGO */}{" "}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 text-primary"
        >
          {" "}
          <ShoppingBag className="size-6" />{" "}
          <span className="text-lg font-bold"> Bozorcha </span>{" "}
        </Link>{" "}
        {/* SEARCH DESKTOP */}{" "}
        <div className="relative hidden flex-1 md:block">
          {" "}
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />{" "}
          <Input placeholder="Mahsulot qidirish..." className="pl-9" />{" "}
        </div>{" "}
        {/* ACTIONS */}{" "}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {" "}
          {/* FAVORITES */}{" "}
          <Link
            to="/favorites"
            className="hidden h-10 w-10 items-center justify-center rounded-md hover:bg-accent sm:inline-flex"
          >
            {" "}
            <Heart className="size-5" />{" "}
          </Link>{" "}
          {/* CART */}{" "}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          >
            {" "}
            <ShoppingCart className="size-5" />{" "}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {" "}
                {cartCount}{" "}
              </span>
            )}{" "}
          </Link>{" "}
          {/* USER MENU */}{" "}
          <DropdownMenu>
            {" "}
            <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent">
              {" "}
              <User className="size-5" />{" "}
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent align="end">
              {" "}
              <DropdownMenuLabel> Mening hisobim </DropdownMenuLabel>{" "}
              <DropdownMenuSeparator />{" "}
              {isAuthenticated ? (
                <>
                  {" "}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    {" "}
                    Profil{" "}
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    {" "}
                    Buyurtmalarim{" "}
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem onClick={() => navigate("/favorites")}>
                    {" "}
                    Sevimlilar{" "}
                  </DropdownMenuItem>{" "}
                  <DropdownMenuSeparator />{" "}
                  <DropdownMenuItem onClick={handleLogout}>
                    {" "}
                    <LogOut className="size-4" /> Chiqish{" "}
                  </DropdownMenuItem>{" "}
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  {" "}
                  Kirish / Ro'yxatdan o'tish{" "}
                </DropdownMenuItem>
              )}{" "}
            </DropdownMenuContent>{" "}
          </DropdownMenu>{" "}
          {/* MOBILE MENU */}{" "}
          <Button variant="ghost" size="icon" className="md:hidden">
            {" "}
            <Menu className="size-5" />{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
      {/* MOBILE SEARCH */}{" "}
      <div className="relative px-4 pb-2 md:hidden">
        {" "}
        <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />{" "}
        <Input placeholder="Mahsulot qidirish..." className="pl-9" />{" "}
      </div>{" "}
      {/* CATEGORY NAV */}{" "}
      <nav className="scrollbar-hide flex gap-5 overflow-x-auto border-t px-4 py-2.5">
        {" "}
        {/* ALL */}{" "}
        <Link
          to="/catalog"
          className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-primary ${isAllCategoriesActive ? "text-primary" : "text-muted-foreground"}`}
        >
          {" "}
          Barcha kategoriyalar{" "}
        </Link>{" "}
        {/* CATEGORIES */}{" "}
        {categories.map((cat) => {
          const isActive = isCatalogPage && currentCategory === cat.slug;
          return (
            <Link
              key={cat._id}
              to={`/catalog?category=${cat.slug}`}
              className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              {" "}
              {cat.name}{" "}
            </Link>
          );
        })}{" "}
      </nav>{" "}
    </header>
  );
}
