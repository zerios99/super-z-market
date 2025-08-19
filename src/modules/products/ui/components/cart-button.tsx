import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
}

export const CartButton = ({ tenantSlug, productId }: Props) => {
  const cart = useCart(tenantSlug);

  return (
    <Button
      variant={"elevated"}
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInChart(productId) && "bg-red-400"
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInChart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
