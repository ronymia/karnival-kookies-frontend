import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import ShowSocialCard from "./ShowSocialCard";
import { FiPhoneCall } from "react-icons/fi";
import NewsletterSection from "@/components/layouts/Newsletter";
import Heading from "@/components/UI/Heading/Heading";

const Footer = () => {
  return (
    <footer
      className={`relative md:pt-40 pb-10 flex flex-col justify-center items-center md:block`}
    >
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 mx-5 md:mx-10`}>
        {/*  */}
        <div className={`space-y-10 z-10`}>
          <img className={`w-24 `} src="/cremeLogo.png" alt="logo" />
          <p className={`max-w-[400px]`}>
            Etiam consequat sem ullamcorper, euismod metus sit amet, tristique
            justo. Vestibulum mattis, nisi ut.
          </p>
          <div
            className={`flex items-center gap-4 justify-center md:justify-start`}
          >
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
        {/* SOCIAL LINK */}
        <div className={`space-y-5 z-10`}>
          <div className={`flex flex-col justify-center md:justify-start`}>
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

        {/*  */}
        <NewsletterSection />
        {/* <div className="bg-red-500 py-8 px-4 text-white h-full z-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Stay Connected</h2>
            <p className="mt-2">Exclusive offers</p>
            <p>Subscribe to our news and get updated about exclusive offers!</p>
          </div>
          <form className="mt-6 flex justify-center">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full max-w-md px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-700"
            />
            <button
              type="submit"
              className="bg-[#581c87] text-white px-6 py-2 rounded-r-full font-semibold hover:bg-purple-800 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div> */}
      </div>

      {/*  */}
      <div
        className={`w-[calc(100%-40px)] md:w-[calc(100%-80px)] mx-5 md:mx-10 z-10`}
      >
        <div className={`wavy-line-nav`}></div>
      </div>

      {/*  */}
      <div className={`flex justify-center items-center z-10`}>
        <p>rony mia © All Rights Reserved - 2024 - Project</p>
      </div>
      <img
        src="/footerBg.png"
        alt="bg footer"
        className={`absolute -top-20 left-0 right-0`}
      />
    </footer>
  );
};

export default Footer;
