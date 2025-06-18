import Image from "next/image";

interface ServeCardProps {
    img: string;
    head: string;
    desc1: string;
    desc2: string;
}

export const ServeCard = ({ img, head, desc1,desc2 }: ServeCardProps) => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow p-6 m-5">
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden">
                <Image src={img} alt={head} height={500} width={500} className="object-cover rounded-xl" />
            </div>
            <div className="mt-7 md:mt-0 flex flex-col justify-center md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-600 text-lg">{desc1}</p>
                <p className="text-gray-600 text-lg">{desc2}</p>
            </div>
        </div>
    );
};

export const ServeCard2 = ({ img, head, desc1,desc2 }: ServeCardProps) => {
    return (
        <div className="flex flex-col-reverse md:flex-row items-center bg-white rounded-2xl shadow p-6 m-5">
            <div className="mt-7 md:mt-0 flex flex-col justify-center md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-600 text-lg">{desc1}</p>
                <p className="text-gray-600 text-lg">{desc2}</p>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden ">
                <Image src={img} alt={head} height={500} width={500} className="object-fit rounded-xl ml-auto" />
            </div>
        </div>
    );
};
