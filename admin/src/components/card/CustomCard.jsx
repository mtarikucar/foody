import { useState } from "react";
import Card from "./index";

const CustomCard = ({isSelected, title, author, price, image, bidders, extra, showButton = true,children ,color }) => {
  const [heart, setHeart] = useState(true);
  const cardClass = isSelected ? 'border-blue-500' : 'border-2';
  const menuColor=  color ? ` bg-[${color}]` : "bg-white"
  console.log(menuColor)
  return (
    <Card
      extra={`flex flex-col w-full border-2 h-full !p-4 3xl:p-![18px] ${menuColor} ${cardClass} ${extra} ease-in-out duration-200`}
    >
      <div className="h-full w-full">
        <div className="relative w-full">
          <button
            onClick={() => setHeart(!heart)}
            className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer"
          >

          </button>
        </div>

        <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {" "}
              {title}{" "}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
              By {author}{" "}
            </p>
          </div>

        </div>

        <div className="flex items-center justify-between md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col 2xl:items-start 3xl:flex-row 3xl:items-center 3xl:justify-between">
          <div className="flex">
            <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
              Current Bid: {price} <span>ETH</span>
            </p>
          </div>
          {
            showButton &&
            <button
              href=""
              className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
            >
              Incele
            </button>}
        </div>
      </div>
      {children}
    </Card>
  );
};

export default CustomCard;
