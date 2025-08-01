import NextImage from "next/image";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { calculatePercentage, formatCurrency } from "@/lib/utils";
import LinkButton from "../shared/link-button";
import Link from "next/link";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { getFilteredProduct } from "@/lib/api/products/get-filtered-products";
import { CategoryProduct } from "@/lib/types/types";
import { ProductPrice } from "../currency/price-display";
import { Image } from "@nextui-org/image";
const RelatedProducts = async ({
  categoryId,
  pid,
}: {
  categoryId: string;
  pid: string;
}) => {
  const relatedProducts = await getFilteredProduct({
    category: `${categoryId}`,
  }).then((products) => products?.filter((product) => product.pid !== pid));

  return (
    relatedProducts?.length !== 0 && (
      <>
        <h1 className="mt-14 text-xl font-medium">Related Products</h1>
        <ScrollShadow
          orientation="horizontal"
          hideScrollBar
          className="flex gap-3 pb-10 pt-7"
        >
          {relatedProducts?.map((product, i) => (
            <RelatedProductCard key={i} {...product} />
          ))}
        </ScrollShadow>
      </>
    )
  );
};

export default RelatedProducts;

function RelatedProductCard({
  pid,
  slug,
  image,
  title,
  offerPrice,
  basePrice,
  
}: Omit<CategoryProduct, "stock">) {
  return (
     <Card shadow="none" isPressable className=" relative group flex-1 bg-gray-200 max-w-[250px] shadow-lg" radius="md"  >
       <Link href={`/store/${slug}?pid=${pid}`}>
          <CardBody className= "  flex-grow-0 overflow-visible transition-all group-hover:p-1 ">
            <Image
              as={NextImage}
              shadow="none"
              radius="lg"
              width={400}
              height={400}
              isZoomed
              alt={title}
              className="w-full overflow-hidden object-cover h-60"
              classNames={{
                img: "hover:scale-110 transition-all",
              }}
              src={process.env.NEXT_PUBLIC_IMAGE_URL + image}
            />
          </CardBody>
          <CardFooter className="    bg-[#ffffff9d] backdrop-blur-md rounded-md  flex flex-col w-full  h-full ">
      
            <div className="">
                    <h2 className="text-md font-semibold line-clamp-1">{title}</h2>
                    
                    <p>
                      <span className=" font-bold ">
                        <ProductPrice
                          amount={offerPrice}
                          originalPrice={
                            basePrice > offerPrice ? basePrice : undefined
                          }
                          className="text-orange-500"
                        />
                      </span>{" "}
                      </p>
                   {/* <p className="text-[0.7rem] text-destructive">
              {stock <= 5 && stock > 0 && `Hurry, only ${stock} left`}
            </p>*/}
          </div>
       
       
          </CardFooter>
          </Link>
        </Card>
  );
}
