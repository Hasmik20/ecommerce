"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type Props = {
  img: string[];
};

const ProductImag = ({ img }: Props) => {
  const [currentImg, setCurrentImg] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={img[currentImg]}
        alt="product image"
        width={1000}
        height={1000}
        priority={true}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {img.map((item, index) => (
          <div
            key={item}
            className={cn(
              "border mr-2  cursor-pointer hover:border-orange-800",
              currentImg === index && "border-orange-500"
            )}
            onClick={() => setCurrentImg(index)}
          >
            <Image src={item} alt="product image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImag;
