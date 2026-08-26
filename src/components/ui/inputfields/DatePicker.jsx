import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { BiReset } from "react-icons/bi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FcCalendar } from "react-icons/fc";

export default function DatePicker({
  id,
  name,
  label,
  defaultDate,
  placeholder,
  required = false,
  disabled = false,
  readOnly = true,
  multiSelect = false,
  weekSelect = false,
  dateRange = false,
  error,
  offDays = [],
  offDayClassName,
  specialDates = [],
  disabledDates = [],
  disableBeforeDate,
  disableAfterDate,
  fieldClassName,
  visibleBorder = false,
  onChange,
  wrapperClassName,
  dataAuto,
  right,
  top,
  small,
  startOfYear,
  formatDate = "DD-MM-YYYY",
}) {
  const [selectedDates, setSelectedDates] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [currentYear, setCurrentYear] = useState(
    startOfYear && moment(startOfYear, "DD-MM-YYYY", true).isValid()
      ? moment(startOfYear, "DD-MM-YYYY").year()
      : moment().year()
  );
  const [hoveredDay, setHoveredDay] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [renderComponent, setRenderComponent] = useState("day");
  const [invalidDateError, setInvalidDateError] = useState(null);
  const calendarRef = useRef(null);

  // SET DEFAULT DATE
  useEffect(() => {
    // Validate the default date
    if (defaultDate) {
      const dateArray = Array.isArray(defaultDate)
        ? defaultDate
        : [defaultDate]; // Normalize to array
      const validDates = [];
      const invalidDates = [];

      dateArray.forEach((date) => {
        const parsedDefaultDate = moment(date, "DD-MM-YYYY", true);

        if (
          parsedDefaultDate.isValid() &&
          (!disableBeforeDate ||
            parsedDefaultDate.isSameOrAfter(
              moment(disableBeforeDate, "DD-MM-YYYY")
            )) &&
          (!disableAfterDate ||
            parsedDefaultDate.isSameOrBefore(
              moment(disableAfterDate, "DD-MM-YYYY")
            )) &&
          !disabledDates.some((disabledDate) =>
            parsedDefaultDate.isSame(moment(disabledDate, "DD-MM-YYYY"), "day")
          )
        ) {
          validDates.push(date); // Add valid date to array
        } else {
          invalidDates.push(date); // Add invalid date to invalid dates array
        }
      });

      if (validDates.length > 0) {
        setSelectedDates(validDates); // Set valid dates
        const firstValidDate = moment(validDates[0], "DD-MM-YYYY", true); // Get the first valid date for setting the month and year
        setCurrentMonth(firstValidDate.clone().startOf("month"));
        setCurrentYear(firstValidDate.year());
      }

      if (invalidDates.length > 0) {
        setInvalidDateError(
          `The following date(s) are invalid or out of range: ${invalidDates.join(
            ", "
          )}.`
        );
      } else {
        setInvalidDateError(null); // Clear the error if no invalid dates
      }
    }
    if (error) {
      setInvalidDateError(error);
    }
  }, [error, defaultDate]);

  // SET CURRENT MONTH
  useEffect(() => {
    setCurrentMonth((prevMonth) => {
      const newMonth = moment([currentYear, prevMonth.month(), 1]);
      return newMonth;
    });
  }, [currentYear]);

  // OUT SIDE CLICK HANDLER
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        event.target &&
        !calendarRef.current.contains(event.target)
      ) {
        setCalendarVisible(false);
      }
    };
    if (calendarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarVisible]);

  // Utility function to get all dates between two moments
  const getRangeBetweenDates = (start, end) => {
    const rangeDates = [];
    let currentDay = start.clone();

    while (currentDay.isSameOrBefore(end)) {
      rangeDates.push(currentDay.format("DD-MM-YYYY"));
      currentDay = currentDay.clone().add(1, "day");
    }

    return rangeDates;
  };

  // GET WEEK RANGE
  const getWeekRange = (day) => {
    const startOfWeek = day.clone().startOf("week"); // Start of the week (e.g., Sunday)
    const endOfWeek = day.clone().endOf("week"); // End of the week (e.g., Saturday)
    const weekDates = [];
    let currentDay = startOfWeek;

    while (currentDay.isSameOrBefore(endOfWeek)) {
      weekDates.push(currentDay.format("DD-MM-YYYY"));
      currentDay = currentDay.clone().add(1, "day");
    }

    return weekDates;
  };

  // SELECT DATE
  const handleDateClick = (day) => {
    const formattedDate = day.format("DD-MM-YYYY");
    let updatedSelectedDates = [];

    if (!rangeStart) {
      setRangeStart(day); // First click sets the start of the range
      setSelectedDates([day.format("DD-MM-YYYY")]);
    } else if (!rangeEnd) {
      setRangeEnd(day); // Second click sets the end of the range
      const rangeDates = getRangeBetweenDates(rangeStart, day);
      setSelectedDates(rangeDates);
      onChange(rangeDates);
    } else {
      // Reset the range if a third click is made
      setRangeStart(day);
      setRangeEnd(null);
      setSelectedDates([day.format("DD-MM-YYYY")]);
    }

    if (!dateRange) {
      if (weekSelect) {
        // Select the entire week when weekSelect is true
        updatedSelectedDates = getWeekRange(day);
        setSelectedDates(updatedSelectedDates);
        onChange(updatedSelectedDates);
      } else if (multiSelect) {
        if (selectedDates && selectedDates.includes(formattedDate)) {
          // Deselect date if already selected
          updatedSelectedDates = selectedDates.filter(
            (date) => date !== formattedDate
          );
        } else {
          // Select new date
          updatedSelectedDates = selectedDates
            ? [...selectedDates, formattedDate]
            : [formattedDate];
        }
        setSelectedDates(updatedSelectedDates);
        onChange(updatedSelectedDates);
      } else {
        setSelectedDates([formattedDate]);
        setCalendarVisible(false);
        onChange(formattedDate);
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
    setCurrentYear(currentMonth.clone().subtract(1, "month").year());
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
    setCurrentYear(currentMonth.clone().add(1, "month").year());
  };

  const goToPreviousYearSet = () => {
    setCurrentYear((prevYear) => prevYear - 12);
  };

  const goToNextYearSet = () => {
    setCurrentYear((prevYear) => prevYear + 12);
  };

  const renderWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekDays.map((weekDay, index) => (
      <div key={`weekDay-${index}`} className="w-10 text-center py-2 font-bold">
        {weekDay}
      </div>
    ));
  };

  // GENERATE YEARS FOR CALENDER
  const renderCalendarYears = () => {
    const startYear = currentYear - (currentYear % 12);
    return Array.from({ length: 12 }, (_, index) => startYear + index);
  };

  // GENERATE MONTHS FOR CALENDER
  const renderCalendarMonths = () => {
    return Array.from({ length: 12 }, (_, i) =>
      moment().month(i).format("MMMM")
    );
  };

  const handleMouseEnter = (day) => {
    setHoveredDay(day);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const renderCalendarDays = () => {
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const daysInMonth = [];
    let currentDay = startOfMonth.clone();

    while (currentDay.isSameOrBefore(endOfMonth, "day")) {
      daysInMonth.push(currentDay);
      currentDay = currentDay.clone().add(1, "day");
    }

    const today = moment();
    const hoveredWeek = hoveredDay ? getWeekRange(hoveredDay) : [];
    const rangeBetweenDates =
      rangeStart && rangeEnd ? getRangeBetweenDates(rangeStart, rangeEnd) : [];

    // Calculate number of empty divs for alignment
    const emptyDivs = startOfMonth.day(); // Day of the week for the first day of the month (0 = Sun, 1 = Mon, etc.)

    return (
      <>
        {/* Render empty divs for alignment */}
        {Array.from({ length: emptyDivs }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-10 h-10 bg-transparent"
          ></div>
        ))}

        {/* Render days of the month */}
        {daysInMonth.map((day) => {
          const isOffDay = offDays.includes(day.day());
          const isSelected =
            selectedDates &&
            selectedDates.some((selectedDate) =>
              day.isSame(moment(selectedDate, "DD-MM-YYYY"), "day")
            );

          const isToday = day.isSame(today, "day");
          const isDisabledBefore =
            disableBeforeDate &&
            day.isBefore(moment(disableBeforeDate, "DD-MM-YYYY"));
          const isDisabledAfter =
            disableAfterDate &&
            day.isAfter(moment(disableAfterDate, "DD-MM-YYYY"));
          const isDisabled = disabledDates.some((disabledDate) =>
            day.isSame(moment(disabledDate, "DD-MM-YYYY"), "day")
          );
          const isSpecialDate = specialDates.some((specialDate) =>
            day.isSame(moment(specialDate, "DD-MM-YYYY"), "day")
          );
          const isDisabledInDateRange =
            isDisabled && (isDisabledBefore || isDisabledAfter);
          const isSpecialDateInDateRange =
            isSpecialDate && (isDisabledBefore || isDisabledAfter);
          const isInHoveredWeek = hoveredWeek.includes(
            day.format("DD-MM-YYYY")
          );
          const isInRange = rangeBetweenDates.includes(
            day.format("DD-MM-YYYY")
          );

          let buttonClass = "w-10 h-10 rounded-md ";
          if (isSelected) {
            buttonClass += " bg-primary text-base-300 border-primary";
          } else if (isToday) {
            buttonClass += " bg-blue-100";
          } else if (isDisabledInDateRange) {
            buttonClass +=
              " bg-yellow-300 cursor-not-allowed border-yellow-300";
          } else if (isSpecialDateInDateRange) {
            buttonClass += " bg-green-500 text-white border-green-500";
          } else if (isDisabled && !isDisabledBefore && !isDisabledAfter) {
            buttonClass +=
              " bg-yellow-300 cursor-not-allowed border-yellow-300";
          } else if (isDisabledBefore || isDisabledAfter) {
            buttonClass +=
              " border border-solid border-gray bg-gray opacity-20";
          } else if (isSpecialDate) {
            buttonClass += " bg-green-500 text-white border-green-500";
          } else if (isOffDay) {
            buttonClass += offDayClassName;
          }
          // else if (isToday) {
          //   buttonClass += " bg-blue-100";
          // }
          else {
            buttonClass +=
              " bg-gray-500 bg-opacity-40 border-gray-500 border-opacity-40 hover:border-primary hover:bg-primary-content ";
          }
          if (isDisabled && (isDisabledBefore || isDisabledAfter)) {
            buttonClass += " disabled-before-after";
          }
          buttonClass += isInHoveredWeek ? " bg-yellow-100" : "";
          buttonClass += isInRange ? " bg-green-100" : "";

          return (
            <button
              type="button"
              data-auto={`days`}
              title={`${isOffDay ? "College Off Day" : ""}`}
              key={day.format("x")}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => weekSelect && handleMouseEnter(day)}
              onMouseLeave={() => weekSelect && handleMouseLeave()}
              className={` ${buttonClass} ${
                small ? "h-7 w-7" : "md:h-10 md:w-10 h-7 w-7"
              }`}
              disabled={isDisabled || !!isDisabledBefore || !!isDisabledAfter}
            >
              {day.format("D")}
            </button>
          );
        })}
      </>
    );
  };

  // MONTH AND YEAR
  const renderMonthAndYear = () => {
    return (
      <div
        data-auto={`month_year_component`}
        className="inline-flex items-center justify-center gap-x-2 w-full font-semibold text-lg"
      >
        {/* MONTH */}
        <button
          type="button"
          data-auto={`select_month`}
          onClick={() => setRenderComponent("month")} // SHOW MONTH COMPONENT
        >
          {currentMonth.format("MMMM")}
        </button>
        {/* YEAR */}
        <button
          type="button"
          data-auto={`select_year`}
          onClick={() => setRenderComponent("year")} // SHOW YEAR COMPONENT
        >
          {currentMonth.format("YYYY")}
        </button>
      </div>
    );
  };

  const handleMonthClick = (index) => {
    setCurrentMonth(currentMonth.clone().month(index));
    setRenderComponent("day");
  };

  const handleYearClick = (year) => {
    setCurrentYear(year);
    setRenderComponent("day");
  };

  return (
    <div
      ref={calendarRef}
      data-auto={`${dataAuto}-date_picker_wrapper`}
      className={`relative flex flex-col justify-start gap-y-2 w-full ${wrapperClassName}`}
    >
      {/* LABEL */}
      {label && (
        <label
          htmlFor={id}
          data-auto={`${dataAuto}-date_picker_label`}
          className="label-text text-md font-bold"
        >
          {label}{" "}
          {!disabled && required && (
            <span className="text-error font-bold text-md">*</span>
          )}
        </label>
      )}

      {/* INPUT FIELD */}
      <div className="relative">
        <input
          data-auto={dataAuto}
          type="text"
          id={id}
          name={name}
          value={
            Array.isArray(selectedDates)
              ? selectedDates.join(", ")
              : selectedDates
              ? moment(selectedDates, "DD-MM-YYYY").format(formatDate)
              : ""
          }
          placeholder={placeholder || "Select Date"}
          onClick={() => !disabled && setCalendarVisible(!calendarVisible)}
          // onChange={handleInputChange}
          readOnly={readOnly}
          // className="w-96 h-11 border border-solid border-gray-300 rounded px-2 py-1"
          className={`text-base-300 bg-secondary rounded border border-solid  px-3 py-2 placeholder:text-sm placeholder:capitalize input-md w-full
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "input-bordered focus:border-primary focus:outline-primary "
        } 
        ${fieldClassName} 
          ${
            disabled
              ? `${
                  visibleBorder && "disabled:border-gray-200 border-opacity-10"
                }`
              : ""
          }
          `}
          // disabled={disabled}
        />
        <button
          type="button"
          disabled={calendarVisible}
          className={`absolute text-3xl right-1  bottom-1/2 translate-y-1/2 ${
            selectedDates ? "-top-4" : "top-0"
          } `}
        >
          {selectedDates ? (
            <BiReset
              data-tip="reset"
              data-auto={`${dataAuto}-date_picker_reset`}
              className={`tooltip tooltip-bottom  text-xl text-primary `}
              onClick={(event) => {
                event.preventDefault();
                if (!disabled) {
                  setSelectedDates(null);
                  onChange("");
                }
              }}
            />
          ) : (
            <FcCalendar
              className="text-primary"
              onClick={() => !disabled && setCalendarVisible(!calendarVisible)}
            />
          )}
        </button>
      </div>

      {/* RENDER CALENDER */}
      {calendarVisible && (
        <div
          data-auto={`date_picker`}
          className={`w-[350px] absolute bg-base-300 shadow-xl border p-5 rounded-md   top-24 z-[999]
            ${right ? "right-0" : "left-0"}
            ${top ? "bottom-full -mb-6" : "top-full mt-2"}
            ${
              small
                ? "md:w-[250px]  px-3  py-3"
                : "md:w-[350px] px-3 md:px-5   md:py-5"
            }
            `}
        >
          {/* DATE SELECT */}
          {renderComponent === "day" && (
            <section data-auto={`date_component`}>
              {/* MONTH AND YEAR NAME */}
              <header className="flex justify-between">
                {/* PREVIOUS BUTTON */}
                <button
                  type="button"
                  data-auto={`prev_month`}
                  onClick={goToPreviousMonth}
                >
                  {" "}
                  <FaAngleLeft size={24} />{" "}
                </button>
                {/* SHOW MONTH AND YEAR */}
                {renderMonthAndYear()}
                {/* NEXT BUTTON */}
                <button
                  type="button"
                  data-auto={`next_month`}
                  onClick={goToNextMonth}
                >
                  {" "}
                  <FaAngleRight size={24} />
                </button>
              </header>

              {/* RENDER WEEKS AND DAYS */}
              <section
                data-auto={`${dataAuto}-calender_days`}
                className="grid grid-cols-7 mt-4 gap-1"
              >
                {renderWeekDays()}
                {renderCalendarDays()}
              </section>
            </section>
          )}

          {/* MONTH SELECT COMPONENT */}
          {renderComponent === "month" && (
            <section data-auto={`month_component`}>
              {/* TITLE */}
              <header className="flex items-center justify-center">
                <h3
                  className={`text-center mb-2 text-primary text-lg font-medium`}
                >
                  Select Month
                </h3>
              </header>
              {/* MONTH LIST */}
              <section
                data-auto={`month_list`}
                className="grid grid-cols-3 gap-1 mt-4"
              >
                {renderCalendarMonths().map((month, index) => (
                  <button
                    key={index}
                    type="button"
                    data-auto={`${dataAuto}-month`}
                    onClick={() => handleMonthClick(index)}
                    className={`btn ${
                      currentMonth.month() === index
                        ? "bg-primary text-white"
                        : "border border-solid border-gray bg-primary-content opacity-60 hover:bg-primary hover:opacity-90 hover:text-white"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </section>
            </section>
          )}

          {/* YEAR COMPONENT */}
          {renderComponent === "year" && (
            <section data-auto={`year_component`}>
              {/* HEADER */}
              <header className="flex justify-between">
                {/* PREVIOUS YEARS BUTTON */}
                <button
                  type="button"
                  data-auto={`prev_year`}
                  onClick={goToPreviousYearSet}
                >
                  {" "}
                  <FaAngleLeft size={24} />
                </button>
                {/*  */}
                <span>{`${currentYear - 11} - ${currentYear}`}</span>
                {/* NEXT YEARS BUTTON */}
                <button
                  type="button"
                  data-auto={`next_year`}
                  onClick={goToNextYearSet}
                >
                  <FaAngleRight size={24} />
                </button>
              </header>

              {/* YEAR LIST */}
              <section
                data-auto={`year_list`}
                className="grid grid-cols-3 mt-4"
              >
                {renderCalendarYears().map((year, index) => (
                  <button
                    key={index}
                    type="button"
                    data-auto={`${dataAuto}-year`}
                    onClick={() => handleYearClick(year)}
                    className={`btn ${
                      currentYear === year
                        ? "bg-primary text-white"
                        : "border border-solid border-gray bg-primary-content opacity-60 hover:bg-primary hover:opacity-90 hover:text-white"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </section>
            </section>
          )}
        </div>
      )}
      {invalidDateError && (
        <p
          data-auto={`${dataAuto}-date_picker_error_message`}
          id={`${id}-error`} // ID to link with input field's aria-describedby
          role="alert"
          aria-label="error message"
          aria-live="assertive" // Ensures screen readers announce the message immediately
          aria-atomic="true" // Ensures the whole message is read out
          className="text-xs text-red-500 pt-1"
        >
          {invalidDateError}
        </p>
      )}
    </div>
  );
}
