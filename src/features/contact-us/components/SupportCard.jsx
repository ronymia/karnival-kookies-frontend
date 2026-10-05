"use client";

import PropTypes from "prop-types";
import { FiMail, FiPhoneCall, FiMapPin, FiArrowUpRight } from "react-icons/fi";

const ICON_MAP = {
  email: FiMail,
  phone: FiPhoneCall,
  location: FiMapPin,
};

export default function SupportCard({ contact }) {
  const IconComponent = ICON_MAP[contact.iconType] || FiMail;

  return (
    <div className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#161311]/85 hover:bg-[#1a1614] border border-primary/20 hover:border-primary/50 backdrop-blur-md transition-all duration-300 shadow-xl shadow-black/40 hover:-translate-y-1.5 overflow-hidden">
      {/* AMBIENT GLOW ON HOVER */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-300 pointer-events-none" />

      <div className="space-y-4">
        {/* ICON BADGE */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-primary/10 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300">
          <IconComponent />
        </div>

        {/* TITLE & SUBTITLE */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-white tracking-tight">
            {contact.title}
          </h3>
          <p className="text-xs text-primary/80 font-medium tracking-wide uppercase mt-0.5">
            {contact.subtitle}
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          {contact.description}
        </p>
      </div>

      {/* ITEMS / ACTIONS */}
      <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
        {contact.items?.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noopener noreferrer" : undefined}
            className="group/link flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-200 hover:text-primary transition-colors py-1 cursor-pointer"
          >
            <span className="truncate">{item.label}</span>
            <FiArrowUpRight className="text-sm opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        ))}
      </div>
    </div>
  );
}

SupportCard.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    iconType: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
        isExternal: PropTypes.bool,
      })
    ),
  }).isRequired,
};
