"use client";
import { React, useState } from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className={`flex justify-center items-center text-[20px]`}>
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => setActiveTab(tab?.id)}
          className={` px-6 pt-3 relative hover:text-primary transition-colors ${
            activeTab === tab?.id
              ? "border border-primary rounded-full text-primary"
              : ""
          }`}
        >
          <p className={`text-primary`}>{tab?.name}</p>
          <div className={`w-full ${activeTab === tab?.id ? "opacity-0" : ""}`}>
            <div className={`wavy-line-tabs`}></div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
