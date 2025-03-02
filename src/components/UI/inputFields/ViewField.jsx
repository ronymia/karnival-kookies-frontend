import PropTypes from "prop-types";

export default function ViewField({ Icon, label, value }) {
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
        <span className={`font-normal text-primary text-sm`}>{label}</span>
        <span className={`font-bold text-base-300`}>{value}</span>
      </div>
    </div>
  );
}

/* <==================================== PROP TYPES =================================> */
ViewField.propTypes = {
  Icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
