"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/buttons";
import { FiGlobe, FiLayers, FiFileText } from "react-icons/fi";
import { MetaDataService } from "../services";

export default function MetaDataViewDrawer({ isOpen, onClose, data }) {
  if (!data) return null;

  const pageName = MetaDataService.formatMetaKey(data.meta_key);

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="SEO Meta Data Details"
      description="Inspect search engine snippets, meta tags, and SERP visibility."
      size="lg"
    >
      <div className="flex flex-col h-full justify-between gap-6 pb-6">
        <div className="space-y-6">
          {/* TARGET ROUTE BADGE */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <FiGlobe className="text-base" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Target Application Page
                </span>
                <h4 className="text-white font-semibold text-sm sm:text-base">
                  {pageName}
                </h4>
              </div>
            </div>

            <code className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-primary">
              {data.meta_key}
            </code>
          </div>

          {/* GOOGLE SERP PREVIEW BOX */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <FiLayers className="text-primary text-xs" />
              <span>Google SERP Search Result Display</span>
            </span>

            <div className="space-y-1 bg-[#12100e] p-4 rounded-2xl border border-primary/20 font-sans shadow-lg">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <span className="text-emerald-400 font-medium">
                  https://karnivalkookies.com
                </span>
                <span>›</span>
                <span className="text-neutral-300 font-mono text-[11px]">
                  {data.meta_key}
                </span>
              </div>

              <h4 className="text-blue-400 text-base font-medium leading-snug">
                {data.title}
              </h4>

              <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                {data.description}
              </p>
            </div>
          </div>

          {/* RAW TAG VALUES */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <FiFileText className="text-primary text-xs" />
                <span>Full Page Title ({data.title?.length || 0} chars)</span>
              </span>
              <p className="text-xs text-neutral-200 bg-white/5 p-3 rounded-xl border border-white/10 font-mono">
                {data.title}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <FiFileText className="text-primary text-xs" />
                <span>Full Meta Description ({data.description?.length || 0} chars)</span>
              </span>
              <p className="text-xs text-neutral-200 bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-w-[120px]"
          >
            Close
          </Button>
        </div>
      </div>
    </SlideOverDrawer>
  );
}

MetaDataViewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
