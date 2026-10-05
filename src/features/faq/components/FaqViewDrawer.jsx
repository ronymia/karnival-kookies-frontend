"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/buttons";
import { FiHelpCircle, FiCheckCircle } from "react-icons/fi";

export default function FaqViewDrawer({ isOpen, onClose, data }) {
  if (!data) return null;

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="FAQ Item Details"
      description="Inspect customer query phrasing and full rich text answer response."
      size="lg"
    >
      <div className="flex flex-col h-full justify-between gap-6 pb-6">
        <div className="space-y-6">
          {/* QUESTION CARD */}
          <div className="p-5 rounded-2xl bg-white/5 border border-primary/25 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <FiHelpCircle className="text-sm" />
              <span>Customer Question</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-white leading-snug">
              {data.question}
            </h3>
          </div>

          {/* ANSWER CARD */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <FiCheckCircle className="text-primary text-sm" />
              <span>Official Answer Response</span>
            </div>
            <div
              className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm text-neutral-200 leading-relaxed ql-snow space-y-3"
              dangerouslySetInnerHTML={{ __html: data.answer }}
            />
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

FaqViewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
