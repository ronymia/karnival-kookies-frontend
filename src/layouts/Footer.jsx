import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiPhoneCall, FiMapPin, FiMail, FiClock } from "react-icons/fi";
import ShowSocialCard from "@/shared/ShowSocialCard";
import NewsletterSection from "@/components/layouts/Newsletter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      href: "https://facebook.com",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      href: "https://twitter.com",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://youtube.com",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Artisan Menu", href: "/shop-product" },
    { name: "Combo Packages", href: "/shop-product" },
    { name: "About Us", href: "/contact-us" },
    { name: "Contact & FAQ", href: "/contact-us" },
  ];

  return (
    <footer className="relative bg-[#0B0A0B] text-neutral-300 pt-16 sm:pt-20 lg:pt-24 pb-12 overflow-hidden border-t border-white/10">
      {/* AMBIENT RADIAL LIGHT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* MAIN FOOTER CONTAINER */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16">
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-between items-start gap-10 lg:gap-8 xl:gap-12">
          {/* BRAND COLUMN */}
          <div className="w-full md:w-[45%] lg:w-auto lg:max-w-xs xl:max-w-sm space-y-5">
            <Link
              href="/"
              className="inline-block"
              aria-label="Karnival Kookies Home"
            >
              <Image
                height={90}
                width={90}
                className="w-24 sm:w-28 drop-shadow-md hover:opacity-90 transition-opacity"
                src="/cremeLogo.png"
                alt="Karnival Kookies Logo"
              />
            </Link>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Handcrafted artisanal cookies and decadent sweet treats, baked
              fresh daily with single-origin cocoa, Madagascar vanilla, and pure
              passion.
            </p>
            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${item.name}`}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-primary hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <IconComponent className="text-base" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* EXPLORE / QUICK LINKS COLUMN */}
          <div className="w-full sm:w-auto min-w-[140px] space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 block mb-1.5">
                Explore
              </span>
              <h4 className="font-serif text-lg sm:text-xl text-white font-normal">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-neutral-400 hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-primary/60 group-hover:text-primary transition-colors">
                      ✦
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT & LOCATION COLUMN */}
          <div className="w-full sm:w-auto min-w-[240px] space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 block mb-1.5">
                Bakery
              </span>
              <h4 className="font-serif text-lg sm:text-xl text-white font-normal">
                Contact & Hours
              </h4>
            </div>
            <div className="space-y-3.5">
              <ShowSocialCard
                Icon={FiPhoneCall}
                text="Phone"
                content="+1 (123) 456-7890"
                href="tel:+11234567890"
              />
              <ShowSocialCard
                Icon={FiMapPin}
                text="Our Location"
                content="975 Liberty Ave, Union, NJ 07083, USA"
                href="https://maps.google.com/?q=975+Liberty+Ave,+Union,+NJ+07083,+USA"
              />
              <ShowSocialCard
                Icon={FiMail}
                text="Email"
                content="support@karnivalkookies.com"
                href="mailto:support@karnivalkookies.com"
              />
              <ShowSocialCard
                Icon={FiClock}
                text="Opening Hours"
                content="Mon - Sat: 9:00 AM - 9:00 PM"
              />
            </div>
          </div>

          {/* NEWSLETTER COLUMN */}
          <div className="w-full sm:w-full md:w-[48%] lg:w-auto lg:max-w-sm xl:max-w-md">
            <NewsletterSection />
          </div>
        </div>

        {/* WAVY DIVIDER LINE */}
        <div className="w-full mt-12 mb-8">
          <div className="wavy-line-nav opacity-35"></div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {currentYear}{" "}
            <span className="text-neutral-400 font-medium">
              Karnival Kookies
            </span>
            . Handcrafted with passion.
          </p>
          <div className="flex items-center gap-5 text-neutral-500">
            <Link
              href="/contact-us"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/contact-us"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/contact-us"
              className="hover:text-neutral-300 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
