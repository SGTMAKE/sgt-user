import Image from 'next/image';
import Link from 'next/link';

const ServiceCard = ({ imgSrc, title, description,golink } :{ imgSrc:string, title:string, description:string,golink:string }) => {
    return (
        
        <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 cursor-pointer  transition-transform duration-300 ease-in-out group">
           <Link href={golink}>
            <div className="relative h-60">
                <Image src={imgSrc} alt={title}   width={900} height={600}  className='h-full' style={{ objectFit: "cover" }}/>
                <div className="absolute inset-0 serviceCard-bg group-hover:bg-none transition-all  duration-500 via-white/25 to-transparent"></div>
            </div>
            <div className="mt-1 p-5 text-center">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-gray-600 text-sm">{description}</p>
            </div>
            </Link>
        </div>
    );
};

export default ServiceCard;
