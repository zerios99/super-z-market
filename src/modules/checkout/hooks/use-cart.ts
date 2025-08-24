import { useCallback } from "react";
import { useCartStore } from "../store/use-cart-store";
import { useShallow } from "zustand/react/shallow";

export const useCart = (tenantSlug: string) => {
  const addProduct = useCartStore((state) => state.addProduct);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || [])
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [addProduct, removeProduct, productIds, tenantSlug]
  );

  const isProductInChart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds]
  );

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [clearCart, tenantSlug]);

  const handelAddProduct = useCallback(
    (productId: string) => {
      addProduct(tenantSlug, productId);
    },
    [tenantSlug, addProduct]
  );

  const handelRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId);
    },
    [tenantSlug, removeProduct]
  );

  return {
    productIds,
    addProduct: handelAddProduct,
    removeProduct: handelRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInChart,
    totalItems: productIds.length,
  };
};
