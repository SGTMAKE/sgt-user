import { calculatePercentage, formatCurrency } from "@/lib/utils";
import NextImage from "next/image";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

type ProductCardProps = {
  image: string;
  title: string;
  offerPrice: number;
  basePrice: number;
  stock: number;
  pid: string;
};

const ProductCard = ({
  image,
  title,
  offerPrice,
  basePrice,
  stock,
  pid,

}: ProductCardProps) => {
  return (
    <Card shadow="none" isPressable className=" relative group flex-1 bg-gray-200 " radius="md">
      <CardBody className= "  flex-grow-0 overflow-visible transition-all group-hover:p-1 ">
        <Image
          as={NextImage}
          shadow="none"
          radius="lg"
          width={400}
          height={400}
          isZoomed
          alt={title}
          className="w-full overflow-hidden object-cover h-72"
          classNames={{
            img: "hover:scale-110 transition-all",
          }}
          src={process.env.NEXT_PUBLIC_IMAGE_URL + image}
        />
      </CardBody>
      <CardFooter className="    bg-[#ffffff9d] backdrop-blur-md rounded-md  flex flex-col w-full  h-full ">
  
        <div className="">
                <h2 className="text-md font-semibold line-clamp-1">{title}</h2>
                
                <p><span className="text-orange-500 font-bold ">{formatCurrency(offerPrice)}
                </span>  <span className="text-gray-400 line-through text-xs font-normal"> {formatCurrency(basePrice)}</span></p>
                <p className="text-[0.7rem] text-destructive">
          {stock <= 5 && stock > 0 && `Hurry, only ${stock} left`}
        </p>
      </div>
      {/* <div className="bg-orange-400 rounded-lg  p-3   scale-y-0 group-hover:scale-y-100 w-full transition-[transform] duration-300 h-0 group-hover:h-max ">
          Add to Cart
      </div> */}
   
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
