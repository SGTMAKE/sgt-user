import NotFound from "@/app/not-found";
import ProductTemplate from "@/components/products/product-template";
import { getProduct } from "@/lib/api/products/get-product";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const data = await getProduct(params.slug, searchParams.pid as string).catch(
    (_) => notFound(),
  );

  const product = data?.product;

  if (!product) {
    notFound();
  }

  return {
    metadataBase: new URL(process.env.METADATA_BASE_URL!),
    title: `${product.title} | SGT Make`,
    description: `${product.description}`,
    openGraph: {
      title: `${product.title} | SGT Make`,
      description: `${product.description}`,
      images: product.colorVariants
        ? [
            process.env.NEXT_PUBLIC_IMAGE_URL! +
              product.colorVariants[0].images.find((image) =>
                image.url.endsWith("-thumb"),
              )?.url,
          ]
        : [],
    },
  };
}

const ProductPage = async ({ params, searchParams }: Props) => {
  const product = await getProduct(
    params.slug,
    searchParams.pid as string,
  ).catch((_) => notFound());
  if (!product?.product) return <NotFound />;

  const productWithCategory = {
    ...product.product,
    category: product.category ?? { description: "" },
  };

  return (
    <>
      <ProductTemplate product={productWithCategory} searchParams={searchParams} />
    </>
  );
};

export default ProductPage;
