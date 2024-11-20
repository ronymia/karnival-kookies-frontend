"use client";
import truncateText from "@/Utils/truncateText";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { IoInformationCircleSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { TfiExchangeVertical } from "react-icons/tfi";
import { TiTick } from "react-icons/ti";
import ButtonLoading from "../ButtonLoading";
import CustomToaster from "../CustomToaster";
import { OutsideClickHandler } from "../OutsideClickHandler";
export default function CustomMultiSelect({
  options = [], // required []

  showCheckbox = true,
  loading = false,
  inputStyleClass = "",
  optionStyleClass = "",
  optionContainerClass = "",
  maxHeight = "max-h-[200px]",
  emptyRecordMsg = "No option found!",
  placeholder = "Search",
  onSelect = (e) => e,
  onRemove = (e) => e,
  onSearch = (e) => e,
  singleSelect = false,
  caseSensitiveSearch = false,
  closeOnSelect = true,
  CustomCloseIcon = RxCrossCircled,
  CustomCheckIcon = TiTick,
  disable = false,
  required = false,
  addButtonLabel = "Select",
  AddButtonIcon = FiPlus,
  ChangeButtonIcon = TfiExchangeVertical,
  label,
  error,
  id,
  top = false,
  left = true,
  right = false,
  bottom = true,

  selectAllOption = false,

  addNewItemButton = false,
  onClickAddNewItemButton = () => {},
  hint = "",
  visibleBorder = false,
  isSearchEnabled = true,
  max = null,
  dataAuto,
  optionsTitle = "Select Option",
  selectedValues = [],
  setSelectedValues,
}) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [searchFieldValue, setSearchFieldValue] = useState("");

  const [isAllSelected, setIsAllSelected] = useState(
    options.length === selectedValues?.length
  );

  useEffect(() => {
    setComponentLoading(true);
    if (!loading) {
      setComponentLoading(true);
      setSelectedValues(selectedValues);
      setFilteredOptions(options);
      setComponentLoading(false);
    }
  }, [loading]);

  const [isFirstTime, setIsFirstTime] = useState(true);
  useEffect(() => {
    if (options.length > 0) {
      if (options.length === selectedValues?.length) {
        setIsAllSelected(true);
      } else {
        setIsAllSelected(false);
      }
    } else {
      setIsAllSelected(false);
    }
  }, [selectedValues]);

  //  SEARCH
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchFieldValue(searchTerm);
    setFilteredOptions(
      options.filter(
        (option) =>
          option.name &&
          option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (!isOptionOpen) {
      setSearchFieldValue("");
      setFilteredOptions(
        options.filter(
          (option) =>
            option.name && option.name.toString().toLowerCase().includes("")
        )
      );
    }
  }, [isOptionOpen]);

  useEffect(() => {
    if (searchFieldValue !== "") {
      !disable && setIsOptionOpen(true);
    }
  }, [searchFieldValue]);

  return (
    <div data-auto={`container-${dataAuto}`} className="w-full relative">
      {/* LABEL */}
      <div className="flex gap-5 items-center justify-between">
        <div className={`flex items-center gap-2`}>
          {label ? (
            <label
              data-auto={`label-${dataAuto}`}
              htmlFor={id}
              className={`label`}
            >
              <span className="label-text  text-md font-bold">
                {label}{" "}
                {required && !disable && (
                  <span className="text-error font-bold text-md">*</span>
                )}
              </span>
            </label>
          ) : (
            <></>
          )}

          {hint && (
            <div
              className={`dropdown ${right && "dropdown-start"} ${
                top && "dropdown-top"
              } ${bottom && "dropdown-bottom"}`}
            >
              <div
                data-auto={`custom-multi-select-hint-button-all-page`}
                tabIndex={0}
                role="button"
                title="info"
                className=" btn btn-circle btn-ghost btn-xs mt-1"
              >
                <IoInformationCircleSharp className={`text-primary text-xl `} />
              </div>
              <div
                tabIndex={0}
                className="card compact dropdown-content z-[1] shadow-lg border border-primary-content shadow-primary-content bg-base-300 rounded-xl w-64"
              >
                <div tabIndex={0} className="card-body">
                  <h2
                    data-auto={`custom-multi-select-hint-label-all-page`}
                    className="card-title text-primary"
                  >
                    {label}
                  </h2>
                  <p data-auto={`custom-multi-select-hint-all-page`}> {hint}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {selectAllOption ? (
          <div className="mt-2 flex items-center gap-2">
            <label role="button" htmlFor="">
              Select all
            </label>
            <input
              data-auto={`custom-multi-select-select-all-input-all-page`}
              id=""
              name=""
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedValues(options);
                } else {
                  setSelectedValues([]);
                }
              }}
              checked={isAllSelected}
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary mr-2"
            />
          </div>
        ) : (
          ""
        )}
      </div>

      {/* FIELD  */}
      <div
        style={{ display: "flex" }}
        className={`relative z-10
        ${
          disable
            ? `h-auto cursor-not-allowed ${
                visibleBorder && "disabled:border-gray-300 border-opacity-10"
              }`
            : `h-auto `
        }
        w-full input ${
          isOptionOpen ? "border-2 border-primary" : ""
        }  flex-wrap rounded-md bg-secondary input-bordered outline-none focus:outline-none items-center px-1`}
        data-auto={dataAuto}
      >
        {/* SELECTED OPTIONS  */}
        {selectedValues?.map((opt, index) => (
          <span
            onClick={() => {
              !disable && setIsOptionOpen(true);
            }}
            title={opt?.name}
            key={index}
            className={`bg-primary-content ${
              !disable && "cursor-pointer"
            } z-10 px-5 ${
              singleSelect ? " py-[0.3rem]" : " py-[0.25rem]"
            } rounded-md my-1 mx-1 inline-flex gap-2 items-center`}
            data-auto={`${dataAuto}-values`}
          >
            {opt?.Icon && <opt.Icon />}{" "}
            {typeof opt?.name === "string" && truncateText(opt?.name, 20)}{" "}
            {!disable && (
              <button
                data-auto={`custom-multi-select-close-button-all-page`}
                onClick={() => {
                  onSelect(
                    selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                  );
                  onRemove(
                    selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                  );
                  selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                    ?.length > 0 &&
                    closeOnSelect &&
                    singleSelect &&
                    setIsOptionOpen(false);
                  setFilteredOptions(options);
                  setSearchFieldValue("");

                  setSelectedValues(
                    selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                  );
                }}
              >
                <CustomCloseIcon
                  className={`text-red-500 hover:bg-red-500 rounded-full hover:text-base-300`}
                />
              </button>
            )}
          </span>
        ))}

        {disable ? (
          <div
            onClick={() => {
              !disable && setIsOptionOpen(!isOptionOpen);
            }}
            className={`relative flex-1 min-w-[100px!important] ${
              singleSelect && selectedValues?.length > 0
                ? "h-[0.26rem]"
                : "h-11"
            } items-center text-gray-600`}
          >
            {singleSelect ? (
              <>
                {selectedValues?.length > 0 ? (
                  ""
                ) : (
                  <input
                    data-auto={`custom-multi-select-single-select-input-all-page`}
                    type="text"
                    value={searchFieldValue}
                    onChange={handleSearch}
                    placeholder={placeholder}
                    disabled
                    className={`w-full input-bordered cursor-not-allowed outline-none bg-transparent px-2 h-full`}
                  />
                )}
              </>
            ) : (
              <input
                data-auto={`custom-multi-select-multi-select-input-all-page`}
                disabled
                type="text"
                value={searchFieldValue}
                onChange={handleSearch}
                placeholder="Search"
                className={`w-full text-base-300 input-bordered cursor-not-allowed outline-none bg-transparent px-2 h-full`}
              />
            )}
          </div>
        ) : (
          <div
            data-auto={`custom-multi-select-option-open-toggle-all-page`}
            onClick={() => {
              setIsOptionOpen(!isOptionOpen);
            }}
            className={`relative flex-1 min-w-[100px!important] ${
              singleSelect && selectedValues?.length > 0
                ? "h-[0.26rem]"
                : "h-11"
            } items-center text-base-300`}
          >
            {singleSelect ? (
              <>
                {selectedValues?.length > 0 ? (
                  ""
                ) : (
                  <input
                    data-auto={`custom-multi-select-input-if-value->1-all-page`}
                    onClick={() => {
                      setIsOptionOpen(!isOptionOpen);
                    }}
                    type="text"
                    value={searchFieldValue}
                    onChange={handleSearch}
                    placeholder={placeholder}
                    className={`w-full input-bordered outline-none bg-transparent px-2 h-full`}
                  />
                )}
              </>
            ) : (
              <input
                data-auto={`custom-multi-select-input-if-not-single-select-all-page`}
                onClick={() => {
                  setIsOptionOpen(!isOptionOpen);
                }}
                type="text"
                value={searchFieldValue}
                onChange={handleSearch}
                placeholder="Search"
                className={`w-full input-bordered outline-none bg-transparent px-2 h-full`}
              />
            )}
          </div>
        )}
      </div>

      {/* OPTIONS  */}
      <OutsideClickHandler
        className={`absolute ${
          top ? "bottom-full -mb-7" : "top-full mt-2"
        } z-30 bg-secondary text-base-300 duration-200 transition-all overflow-hidden  ${
          isOptionOpen ? "opacity-100 h-auto block" : "opacity-0 h-0 hidden"
        }  shadow-lg border-2 border-primary rounded-md w-full left-0`}
        onOutsideClick={() => {
          setIsOptionOpen(false);
        }}
        dataAuto={`${dataAuto}-option-wrapper`}
      >
        <h3 className={`text-center py-2 font-medium shadow-md`}>
          {optionsTitle}
        </h3>
        <div
          className={`overflow-y-auto px-0 py-0 overflow-x-hidden ${maxHeight}  scrollbar `}
          data-auto={`${dataAuto}-option-container`}
        >
          {componentLoading ? (
            <div className="flex justify-center items-center py-5">
              <ButtonLoading />
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <Fragment key={index}>
                <button
                  data-auto={`${dataAuto}-${opt?.name}`}
                  onClick={() => {
                    if (
                      selectedValues?.some((s_opt) => s_opt?.id === opt?.id)
                    ) {
                      // IF ALREADY SELECTED
                      onSelect(
                        selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                      );
                      onRemove(
                        selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                      );
                      selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                        ?.length > 0 &&
                        closeOnSelect &&
                        singleSelect &&
                        setIsOptionOpen(false);
                      setFilteredOptions(options);
                      setSearchFieldValue("");

                      setSelectedValues(
                        selectedValues?.filter((s_opt) => s_opt?.id !== opt?.id)
                      );
                    } else {
                      // IF NOT SELECTED
                      if (!max) {
                        if (singleSelect) {
                          onSelect([opt]);
                          onRemove([opt]);
                          [opt]?.length > 0 &&
                            closeOnSelect &&
                            singleSelect &&
                            setIsOptionOpen(false);
                          setFilteredOptions(options);
                          setSearchFieldValue("");

                          setSelectedValues([opt]);
                        } else {
                          onSelect([...selectedValues, opt]);
                          onRemove([...selectedValues, opt]);
                          [...selectedValues, opt]?.length > 0 &&
                            closeOnSelect &&
                            singleSelect &&
                            setIsOptionOpen(false);
                          setFilteredOptions(options);
                          setSearchFieldValue("");

                          setSelectedValues([...selectedValues, opt]);
                        }
                      } else {
                        if (selectedValues?.length + 1 >= max) {
                          setIsOptionOpen(false);
                        }

                        if (selectedValues?.length < max) {
                          if (singleSelect) {
                            onSelect([opt]);
                            onRemove([opt]);
                            [opt]?.length > 0 &&
                              closeOnSelect &&
                              singleSelect &&
                              setIsOptionOpen(false);
                            setFilteredOptions(options);
                            setSearchFieldValue("");

                            setSelectedValues([opt]);
                          } else {
                            onSelect([...selectedValues, opt]);
                            onRemove([...selectedValues, opt]);
                            [...selectedValues, opt]?.length > 0 &&
                              closeOnSelect &&
                              singleSelect &&
                              setIsOptionOpen(false);
                            setFilteredOptions(options);
                            setSearchFieldValue("");

                            setSelectedValues([...selectedValues, opt]);
                          }
                        } else {
                          toast.custom((t) => (
                            <CustomToaster
                              t={t}
                              type={"error"}
                              text={`Maximum items exceeded!`}
                            />
                          ));
                        }
                      }
                    }
                  }}
                  className={`px-5 py-1   justify-between w-full flex gap-2 items-center   ${
                    showCheckbox &&
                    selectedValues?.some((s_opt) => s_opt?.id === opt?.id)
                      ? "bg-primary text-base-300"
                      : "hover:bg-primary-content"
                  }`}
                >
                  <span className="inline-flex  gap-2 items-center text-left w-full">
                    {opt?.Icon && <opt.Icon />} {opt?.name}
                  </span>

                  {selectedValues?.some((s_opt) => s_opt?.id === opt?.id) &&
                    showCheckbox && (
                      <CustomCheckIcon
                        className={`${
                          selectedValues?.some((s_opt) => s_opt?.id === opt?.id)
                            ? "text-base-300"
                            : ""
                        }`}
                      />
                    )}
                </button>
                {index + 1 < filteredOptions.length ? <hr /> : ""}
              </Fragment>
            ))
          ) : (
            <div className="flex justify-center items-center py-5">
              <span className={`font-bold text-red-500`}>{emptyRecordMsg}</span>
            </div>
          )}
        </div>
        {addNewItemButton && (
          <button
            data-auto={`custom-multi-select-add-new-button-all-page`}
            onClick={onClickAddNewItemButton}
            className={`w-full border-t border-base-100 text-center bg-primary text-base-300 py-2 hover:bg-primary-focus`}
          >
            Add New
          </button>
        )}
      </OutsideClickHandler>

      {/* VALIDATION MESSAGE  */}
      {error && (
        <label
          data-auto={`custom-multi-select-error-message-all-page`}
          className="label h-7"
        >
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
