import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import Heading from "./Heading";
import ShowSocialCard from "./ShowSocialCard";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <div
      className={`relative md:pt-40 pb-10 flex flex-col justify-center items-center md:block`}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 mx-5 md:mx-10`}>
        <div className={`space-y-10 z-10`}>
          <img className={`w-24 `} src="/cremeLogo.png" alt="logo" />
          <p className={`max-w-[400px]`}>
            Etiam consequat sem ullamcorper, euismod metus sit amet, tristique
            justo. Vestibulum mattis, nisi ut.
          </p>
          <div className={`flex items-center gap-4 `}>
            <FaTwitter
              className={`text-2xl text-primary hover:text-base-300 transition-colors`}
            />
            <FaFacebook
              className={`text-2xl text-primary hover:text-base-300 transition-colors`}
            />
            <FaInstagram
              className={`text-2xl text-primary hover:text-base-300 transition-colors`}
            />
            <FaYoutube
              className={`text-2xl text-primary hover:text-base-300 transition-colors`}
            />
          </div>
        </div>
        <div className={`space-y-5 z-10`}>
          <div className={`flex flex-col justify-start`}>
            <Heading
              isSubHeading={false}
              heading={"Explore"}
              headingClass={"text-primary"}
              headingContainerClass=""
            />
          </div>
          <ShowSocialCard
            Icon={FiPhoneCall}
            text={"Phone"}
            content={"+123 456 7890"}
          />
          <ShowSocialCard
            Icon={FiPhoneCall}
            text={"Our Location"}
            content={"975 Liberty Ave, Union, NJ 07083, USA"}
          />
          <ShowSocialCard
            Icon={FiPhoneCall}
            text={"Email"}
            content={"pastryshop@themes.com"}
          />
        </div>
      </div>
      <div
        className={`w-[calc(100%-40px)] md:w-[calc(100%-80px)] mx-5 md:mx-10 z-10`}
      >
        <div className={`wavy-line-nav`}></div>
      </div>
      <div className={`flex justify-center items-center z-10`}>
        <p>mozammal © All Rights Reserved - 2024 - Project</p>
      </div>
      <img
        src="/footerBg.png"
        alt="bg footer"
        className={`absolute -top-20 left-0 right-0`}
      />
    </div>
  );
};

export default Footer;
