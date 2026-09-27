import { Link } from "react-router-dom";
import { ShoppingBag, Send, Instagram, Facebook } from "lucide-react";

export function UserFooter() {
  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-primary">
            <ShoppingBag className="size-5" />
            <span className="text-lg font-bold">Bozorcha</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            O'zbekiston bo'ylab yetkazib berish bilan onlayn do'kon. Amaliyot loyihasi.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <Send className="size-5" />
            <Instagram className="size-5" />
            <Facebook className="size-5" />
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Mijozlarga</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/catalog" className="hover:text-foreground">Katalog</Link></li>
            <li><Link to="/orders" className="hover:text-foreground">Buyurtmalarim</Link></li>
            <li><Link to="/favorites" className="hover:text-foreground">Sevimlilar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Kompaniya</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="cursor-default">Biz haqimizda</span></li>
            <li><span className="cursor-default">Aloqa</span></li>
            <li><span className="cursor-default">Vakansiyalar</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Aloqa</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>+998 90 123 45 67</li>
            <li>support@bozorcha.uz</li>
            <li>Toshkent, O'zbekiston</li>
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bozorcha. Barcha huquqlar himoyalangan. (Amaliyot loyihasi)
      </div>
    </footer>
  );
}
