import React from "react";

const ShowSocialCard = ({ Icon, text, content }) => {
  return (
    <div className={`flex items-center gap-2`}>
      <Icon className={`text-2xl text-primary`} />
      <div>
        <p className={`text-primary`}>{text}:</p>
        <p className={`hover:text-base-300 transition-colors`}>{content}</p>
      </div>
    </div>
  );
};

export default ShowSocialCard;
