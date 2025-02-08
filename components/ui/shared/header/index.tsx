import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Mode from "./mode";

const Header = () => {
  return (
    <header className="w-full border-b ">
      <div className="wrapper flex-between ">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={48}
              height={48}
              priority={true}
            />
            <span className="hidden lg:block text-2xl font-bold ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Mode />
      </div>
    </header>
  );
};

export default Header;
