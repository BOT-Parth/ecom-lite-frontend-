import { Outlet, useParams } from "react-router-dom";
import { CartProvider } from "../context/CartContext";

const PublicStoreLayout = () => {
  const { storeSlug } = useParams();

  return (
    <CartProvider key={storeSlug}>
      <Outlet />
    </CartProvider>
  );
};

export default PublicStoreLayout;
