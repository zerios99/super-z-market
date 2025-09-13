import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface NavbarItems {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItems[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: { id: string; email: string } | null; // نوع أكثر تحديداً
}

export const NavbarSidebar = ({ items, open, onOpenChange, user }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {/* عناصر التنقل الأساسية */}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              {item.children}
            </Link>
          ))}
          
          <div className="border-t">
            {/* إذا كان المستخدم مسجل دخول، إظهار Dashboard */}
            {user ? (
              <Link
                className="w-full text-left p-4 hover:bg-pink-400 hover:text-black bg-black text-white flex items-center text-base font-medium"
                href={"/admin"}
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Dashboard
              </Link>
            ) : (
              // إذا لم يكن مسجل دخول، إظهار Login & Start Selling
              <>
                <Link
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                  href={"/sign-in"}
                  onClick={() => {
                    onOpenChange(false);
                  }}
                >
                  Login
                </Link>
                <Link
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                  href={"/sign-up"}
                  onClick={() => {
                    onOpenChange(false);
                  }}
                >
                  Start Selling
                </Link>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
