import Image from "next/image";
import loadingImg from "@/assets/loader.gif";

const Loading = () => {
  return (
    <div className="flex justify-center  items-center h-screen">
      <Image src={loadingImg} alt="Loading..." width={150} height={150} />
    </div>
  );
};

export default Loading;
