import { Link, NavLink } from "react-router-dom";
import { Heart, Search, ShoppingCart, User, Menu, ShoppingBag } from "lucide-react";
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
import { mockCategories } from "@/data/mockData";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
    isActive ? "text-primary" : "text-muted-foreground"
  }`;

export function UserHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-1.5 text-primary">
          <ShoppingBag className="size-6" />
          <span className="text-lg font-bold">Bozorcha</span>
        </Link>

        <div className="relative hidden flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Mahsulot qidirish..." className="pl-9" />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link to="/favorites">
              <Heart className="size-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="size-5" />
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                3
              </span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mening hisobim</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders">Buyurtmalarim</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/favorites">Sevimlilar</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login">Kirish / Ro'yxatdan o'tish</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <div className="relative px-4 pb-2 md:hidden">
        <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Mahsulot qidirish..." className="pl-9" />
      </div>

      <nav className="scrollbar-hide flex gap-5 overflow-x-auto border-t px-4 py-2.5">
        <NavLink to="/catalog" className={navLinkClass} end>
          Barcha kategoriyalar
        </NavLink>
        {mockCategories.map((cat) => (
          <NavLink key={cat._id} to={`/catalog?category=${cat.slug}`} className={navLinkClass}>
            {cat.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
