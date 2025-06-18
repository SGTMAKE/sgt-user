import Image from "next/image";

interface SocialCardProps {
        img: string;
        title: string;
        text: string;
}


export const SocialCard = ({ img, title, text }: SocialCardProps) => {
    return (
        <>
        <div className="flex flex-wrap items-center">
            <div className="bg-[#FC4C0229] p-2 rounded-2xl flex items-center justify-center">
                <Image src={img} alt={title} height={26} width={26} className="object-fit" /> 
            </div>
            <div className="text-left mx-3">
                <div className="font-semibold">{title}</div>
                <div className="text-slate-400">{text}</div>
            </div>
        </div>
    </>
    );
};
