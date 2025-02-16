"use client";
import Button from "@/components/UI/buttons/Button";
import { useGetPriceBoundsQuery } from "@/redux/apis/productApis";
import { useState } from "react";

export default function FilterComponent({ setFilters }) {
  const [componentFilters, setComponentFilters] = useState({
    fromPrice: "",
    toPrice: "",
    sortByNewest: "",
    sortOrder: "",
  });
  // GET PRICE BOUNDS MAX AND MIN
  const productPriceBounds = useGetPriceBoundsQuery();

  return (
    <div className="collapse bg-secondary">
      <input type="checkbox" />
      <div className="collapse-title text-2xl font-bold text-center">
        Filters
      </div>
      <div className="collapse-content space-y-3">
        {/* <======================= MIN PRICE FILTER =======================> */}
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
              min={"0"}
              max={
                productPriceBounds.data?.data?.max_price
                  ? parseInt(
                      productPriceBounds.data?.data?.max_price
                    ).toString()
                  : ""
              }
              value={componentFilters?.fromPrice}
              className="range range-xs range-primary"
            />
          </div>

          {/* <======================= MAX PRICE FILTER =======================> */}
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
              min={
                productPriceBounds.data?.data?.min_price
                  ? parseInt(
                      productPriceBounds.data?.data?.min_price
                    ).toString()
                  : ""
              }
              max={
                productPriceBounds.data?.data?.max_price
                  ? parseInt(
                      productPriceBounds.data?.data?.max_price
                    ).toString()
                  : ""
              }
              value={componentFilters?.toPrice}
              className="range range-xs range-primary"
            />
          </div>
        </div>

        {/* SORT BY */}
        <div className={`space-y-2`}>
          <p className={`font-semibold text-xl text-primary `}>Sort by</p>

          {/* NEWEST */}
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

          {/* <======================= LOW TO HIGHT FILTER =======================> */}
          <div>
            <label className={`flex items-center gap-2`}>
              <input
                type="checkbox"
                className="checkbox"
                name="lowToHigh"
                value={"lowToHigh"}
                checked={componentFilters?.sortOrder === "lowToHigh"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setComponentFilters((prev) => ({
                      ...prev,
                      sortOrder: "lowToHigh",
                    }));
                  } else {
                    setComponentFilters((prev) => ({
                      ...prev,
                      sortOrder: "",
                    }));
                  }
                }}
              />
              Price low to high
            </label>
          </div>

          {/* <======================= HIGH TO LOW FILTER =======================> */}
          <div>
            <label className={`flex items-center gap-2`}>
              <input
                type="checkbox"
                className="checkbox"
                name="highToLow"
                value={"highToLow"}
                checked={componentFilters?.sortOrder === "highToLow"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setComponentFilters((prev) => ({
                      ...prev,
                      sortOrder: "highToLow",
                    }));
                  } else {
                    setComponentFilters((prev) => ({
                      ...prev,
                      sortOrder: "",
                    }));
                  }
                }}
              />
              Price high to low
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
}
