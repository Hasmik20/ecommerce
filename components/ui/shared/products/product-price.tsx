import { cn } from "@/lib/utils";

type Props = {
  value: number;
  className?: string;
};

const ProductPrice = ({ value, className }: Props) => {
  // make decimal from value/price
  const decNumber = value.toFixed(2);
  //   split decNumber/price
  const [intNum, floatNum] = decNumber.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intNum}
      <span className="text-xs align-super">.{floatNum}</span>
    </p>
  );
};

export default ProductPrice;
