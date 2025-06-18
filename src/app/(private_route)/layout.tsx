import Profile from "@/components/navbar/profile";
import ShowPrivateNavbar from "@/components/navbar/show-private-navbar";
import { authOptions } from "@/lib/auth";
import { LayoutProps } from "@/lib/types/types";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const PrivateLayout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    const headersList = headers();
    const currentUrl = headersList.get("x-url") || "";
    redirect(`/authentication?callbackUrl=${encodeURIComponent(currentUrl)}`);
  }
  return (
    <>
      <ShowPrivateNavbar>
        <nav className="mb-5 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={74} height={74} />
            </Link>
            <Profile session={session} />
          </div>
        </nav>
      </ShowPrivateNavbar>
      <main>{children}</main>
    </>
  );
};

export default PrivateLayout;
