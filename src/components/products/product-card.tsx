// import { formatCurrency } from "@/lib/utils";
// import Image from "next/image";
// import { ProductCardProps } from "@/lib/types/types";
// import LinkButton from "../shared/link-button";
// import { Card, CardBody, CardFooter } from "@nextui-org/card";
// import { Image as NextUIImage } from "@nextui-org/image";

// const ProductCard = ({
//   title,
//   imgUrl,
//   description,
//   price,
//   href,
// }: ProductCardProps) => {
//   return (
//     <>
//     <Card className="shadow-md">
//       <CardBody className="p-0">
//         <div className="bg-gray-200 md:p-5">
//           <div className="relative aspect-square">
//             <NextUIImage
//               alt={`${title} Image`}
//               className="rounded-none object-cover"
//               as={Image}
//               src={process.env.NEXT_PUBLIC_IMAGE_URL + imgUrl}
//               isZoomed
//               classNames={{
//                 img: "hover:scale-110",
//                 zoomedWrapper: "rounded-none",
//               }}
//               width={270}
//               height={270}
//             />
//           </div>
//         </div>
//         <CardFooter className="flex flex-1 flex-col items-start gap-3">
//           <h1 className="cutoff-text text-xs font-medium md:text-sm">
//             {title}
//           </h1>
//           <p className="flex-1 text-xs font-medium text-success">
//             {description}
//           </p>
//           <div className="w-full">
//             <LinkButton
//               href={href}
//               className="w-full font-Roboto text-xs font-medium md:text-sm"
//             >{`From ${formatCurrency(price)}`}</LinkButton>
//           </div>
//         </CardFooter>
//       </CardBody>
//     </Card>
    
//     </>
//   );
// };

// export default ProductCard;

import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { ProductCardProps } from "@/lib/types/types";
import Link from "next/link";
const ProductCard = ({
  title,
  imgUrl,
  description,
  price,
  href,

}: ProductCardProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all  cursor-pointer bg-white">
      {/* Product Image */}
      <Link
          href={href}>
      <Image
        src={process.env.NEXT_PUBLIC_IMAGE_URL + imgUrl}
        alt={title}
        width={270}
        height={270}
        className="w-full h-56 object-cover"
      />

      

      {/* Product Info */}
      <div className=" bg-white p-4">
        <h3 className="font-medium text-[clamp(1rem,1.2vw,1.8rem)] line-clamp-2 ">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-lg text-orange-500 font-semibold">
          {formatCurrency(price)}
        </p>

   
      </div>
      </Link>
    </div>
  );
};

export default ProductCard;

