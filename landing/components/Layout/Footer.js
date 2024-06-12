import React from "react";
import LogoVPN from "../../public/assets/Logo.svg";
import Facebook from "../../public/assets/Icon/facebook.svg";
import Twitter from "../../public/assets/Icon/twitter.svg";
import Instagram from "../../public/assets/Icon/instagram.svg";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="bg-white-300 pt-44 pb-24">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <Image src="/assets/logo.png"
                 alt="philofoody logo"
                 quality={100}
                 width={64}
                 height={64}
                 className={"mb-4"}
          />
          <p className="mb-4">
            <strong className="font-medium">Philofoody</strong> işletmelere özel online karekod menü ve adisyon hizmeti sağlayan Saas bir servistir.
          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
            {/*<div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Facebook className="h-6 w-6" />
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Twitter className="h-6 w-6" />
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Instagram className="h-6 w-6" />
            </div>*/}
          </div>
          <p className="text-gray-400">©{new Date().getFullYear()} - Philofoody</p>
        </div>

      </div>
    </div>
  );
};

export default Footer;
