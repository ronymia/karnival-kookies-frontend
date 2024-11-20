"use client";
import { getFilterData } from "@/apis/products";
import Button from "@/Shared/Button";
import React, { useEffect, useState } from "react";

const FilterComponent = ({ filters, setFilters }) => {
  const [componentFilters, setComponentFilters] = useState({
    fromPrice: "",
    toPrice: "",
    sortByNewest: "",
  });
  console.log({ componentFilters });
  const [data, setData] = useState({});

  useEffect(() => {
    getFilterData()
      .then((res) => {
        console.log({ res });
        setData(res);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);
  console.log({ data });
  return (
    <div className="collapse bg-secondary">
      <input type="checkbox" />
      <div className="collapse-title text-2xl font-bold text-center">
        Filters
      </div>
      <div className="collapse-content space-y-3">
        <div>
          <p className={`font-semibold text-xl text-primary `}>Price</p>
          <div className={`space-y-2`}>
            <p>Lowest: ${componentFilters?.fromPrice}</p>
            <input
              onChange={(e) =>
                setComponentFilters((prev) => ({
                  ...prev,
                  fromPrice: e.target.value,
                }))
              }
              type="range"
              min={0}
              max={parseFloat(data?.mostExpensiveProduct?.regularPrice)}
              value={componentFilters?.fromPrice}
              className="range range-xs range-primary"
            />
          </div>
          <div>
            <p>Highest: ${componentFilters?.toPrice}</p>
            <input
              onChange={(e) =>
                setComponentFilters((prev) => ({
                  ...prev,
                  toPrice: e.target.value,
                }))
              }
              type="range"
              min={parseFloat(data?.cheapestProduct?.regularPrice)}
              max={parseFloat(data?.mostExpensiveProduct?.regularPrice)}
              value={componentFilters?.toPrice}
              className="range range-xs range-primary"
            />
          </div>
        </div>
        <div className={`space-y-2`}>
          <p className={`font-semibold text-xl text-primary `}>Sort by</p>
          <div>
            <label className={`flex items-center gap-2`}>
              <input
                type="checkbox"
                className="checkbox"
                name="sort"
                value={true}
                checked={componentFilters?.sortByNewest}
                onChange={(e) =>
                  setComponentFilters((prev) => ({
                    ...prev,
                    sortByNewest: prev?.sortByNewest ? "" : e.target.value,
                  }))
                }
              />
              Newest
            </label>
          </div>
        </div>
        <Button
          text={"Apply Filters"}
          handler={() =>
            setFilters((prev) => ({ ...prev, ...componentFilters }))
          }
        />
      </div>
    </div>
  );
};

export default FilterComponent;
