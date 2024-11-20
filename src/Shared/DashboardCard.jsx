const DashboardCard = ({ header, containerClass, content }) => {
  return (
    <div className={`${containerClass} p-5 rounded-lg text-base-300 space-y-3`}>
      <p className={`font-semibold text-xl `}>{header}</p>
      {content}
    </div>
  );
};

export default DashboardCard;
