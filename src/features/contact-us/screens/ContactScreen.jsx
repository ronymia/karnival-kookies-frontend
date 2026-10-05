"use client";

import Link from "next/link";
import { SupportCard, ContactForm, FaqAccordion } from "../components";
import { useFaqs } from "../hooks";
import { SUPPORT_CONTACTS } from "../services";

export default function ContactScreen() {
  const { faqs } = useFaqs();

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-neutral-100 pb-24 sm:pb-28">
      {/* <============================= COMPACT EDITORIAL HEADER ============================> */}
      <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 text-center overflow-hidden">
        {/* SUBTLE AMBIENT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[180px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-3">
          {/* BREADCRUMB BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-primary/20 backdrop-blur-md text-[11px] uppercase font-semibold tracking-widest text-primary">
            <Link
              href="/"
              className="hover:underline text-neutral-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-primary/60">/</span>
            <span>Contact Us</span>
          </div>

          {/* PAGE TITLE */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            We&apos;d Love to Hear From You
          </h1>

          {/* SUBTITLE */}
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
            Whether you have a question about our secret-batch recipes, need event catering, or want a custom cookie gift box, we are always delighted to connect.
          </p>

          {/* WAVY ACCENT DIVIDER */}
          <div className="w-[80px] mx-auto pt-1">
            <div className="wavy-line-heading"></div>
          </div>
        </div>
      </section>

      {/* <============================= MAIN CONTENT CONTAINER ============================> */}
      <div className="w-full px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 space-y-16 sm:space-y-24">
        {/* 1. SUPPORT CARDS (3-COLUMN GRID) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SUPPORT_CONTACTS.map((contact) => (
            <SupportCard key={contact.id} contact={contact} />
          ))}
        </section>

        {/* 2. CONTACT FORM SECTION */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white">
              Get in Touch
            </h2>
            <div className="w-[60px] mx-auto">
              <div className="wavy-line-heading"></div>
            </div>
          </div>

          <ContactForm />
        </section>

        {/* 3. FREQUENTLY ASKED QUESTIONS SECTION */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white">
              Frequently Asked Questions
            </h2>
            <div className="w-[60px] mx-auto">
              <div className="wavy-line-heading"></div>
            </div>
          </div>

          <FaqAccordion faqs={faqs} />
        </section>
      </div>
    </div>
  );
}
