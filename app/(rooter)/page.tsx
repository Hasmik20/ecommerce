import IconBoxes from "@/components/ui/shared/icon-boxes";
import ProductList from "@/components/ui/shared/products/product-list";
import ViewAllProductsButton from "@/components/ui/shared/view-all-products-button";
import { getLatestProducts } from "@/lib/actions/product.action";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
      <IconBoxes />
    </>
  );
};

export default Homepage;
