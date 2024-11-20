import React from "react";

const SupportCard = ({ support, index, length }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-5 group ${
        index + 1 === length
          ? ""
          : "lg:border-r-2 border-dotted border-primary-content"
      }`}
    >
      <support.icon
        className={`text-primary text-4xl group-hover:-translate-y-5 transition-transform`}
      />
      <h3 className={`text-xl md:text-3xl`}>{support.name}</h3>
      <div className={`md:text-xl`}>
        {support.contents.map((content, i) => (
          <p key={i}>{content}</p>
        ))}
      </div>
    </div>
  );
};

export default SupportCard;
