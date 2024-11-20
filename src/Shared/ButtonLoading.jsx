export default function ButtonLoading({ classNames, color = "text-primary" }) {
  return (
    <span
      className={`loading loading-spinner loading-md ${classNames} ${color}`}
    ></span>
  );
}
