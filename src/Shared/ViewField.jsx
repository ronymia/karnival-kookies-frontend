export default function ViewField({ Icon, title, value }) {
  return (
    <div className={`flex items-start gap-x-2`}>
      {!!Icon && (
        <div
          className={`flex justify-center items-center w-10 h-10 rounded-full bg-primary-content`}
        >
          <Icon className={`text-lg text-primary`} />
        </div>
      )}
      <div className={`flex flex-col ${Icon ? "w-[calc(100%-2.5rem)]" : ""} `}>
        <span className={`font-normal text-primary text-sm`}>{title}</span>
        <span className={`font-bold text-base-300`}>{value}</span>
      </div>
    </div>
  );
}
