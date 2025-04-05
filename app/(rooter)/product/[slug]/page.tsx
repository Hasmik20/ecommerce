import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import AddToCart from "@/components/ui/shared/products/add-to-cart";
import ProductImag from "@/components/ui/shared/products/product-image";
import ProductPrice from "@/components/ui/shared/products/product-price";
import { getProductDetails } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import { getMyCart } from "@/lib/actions/cart.action";
import { auth } from "@/auth";
import ReviewList from "./review-list";
import Rating from "@/components/ui/shared/products/rating";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) notFound();

  const cart = await getMyCart();

  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* images column */}
          <div className="col-span-2">
            <ProductImag img={product.images} />
          </div>
          {/* details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>

              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-gray-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>

                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold  mb-5">Customer Reviews</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={userId || ""}
        />
      </section>
    </>
  );
};

export default ProductDetailPage;
