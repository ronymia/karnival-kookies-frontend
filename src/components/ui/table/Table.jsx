"use client";
import useDeviceWidth from "@/hooks/useDeviceWidth";
import PropTypes from "prop-types";

export default function Table({
  rows = [],
  columns = [],
  isLoading = false,
  actions = [],
}) {
  const windowInnerWidth = useDeviceWidth();

  return (
    <table className="w-full">
      {/* <===================================== Table Header ===================================> */}
      <thead className="h-16 hidden md:table-header-group bg-primary text-base-300 px-3">
        <tr className=" border-b border-primary-content ">
          {columns?.map((col) => (
            <th
              colSpan={col?.accessorKey === "actions" ? actions?.length : 1}
              align="left"
              key={col?.accessorKey}
              className="font-medium p-2"
            >
              {col?.header}
            </th>
          ))}
          {actions?.length > 0 && (
            <th
              key="actions"
              colSpan={actions?.length}
              className="text-right p-2"
            >
              Action
            </th>
          )}
        </tr>
      </thead>

      {/* <===================================== Table Body ===================================> */}
      <tbody className="block w-full md:table-row-group">
        {!isLoading ? (
          rows?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="block md:table-row border md:border-0 md:border-b border-primary-content bg-secondary md:hover:bg-primary-content md:hover:text-secondary text-sm font-bold mb-4 md:mb-0 p-4 md:p-0 rounded-lg"
            >
              {/* <===================================== Action for Mobile ====================================> */}
              {windowInnerWidth < 768 && actions?.length > 0 && (
                <td
                  colSpan={columns?.length + 1}
                  className="w-full p-2 flex items-center justify-center"
                >
                  {actions
                    .filter((action) => {
                      return !action?.disableOn?.some((disable) => {
                        return row?.[disable?.accessorKey] === disable?.value;
                      });
                    })
                    .map((action) => (
                      <button
                        key={action?.name}
                        type="button"
                        onClick={() => action?.handler?.(row)}
                      >
                        <action.Icon
                          className={`text-xl ${
                            action?.name === "delete"
                              ? " text-red-500"
                              : "text-primary"
                          }`}
                        />
                      </button>
                    ))}
                </td>
              )}

              {/* <===================================== Table Columns ===================================> */}
              {columns?.map((col) => (
                <td
                  key={col?.accessorKey}
                  data-label={col?.["header"]}
                  className="block md:table-cell py-3 md:py-4 px-3 border md:border-none border-gray-200"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-normal md:hidden">
                      {col?.["header"]}
                    </span>
                    <span>{row?.[col?.accessorKey]}</span>
                  </div>
                </td>
              ))}

              {/* <===================================== Action for Desktop ==================================> */}
              {windowInnerWidth > 768 && actions?.length > 0 && (
                <td className="hidden md:table-cell text-right p-2 pr-6">
                  <div className="flex justify-end space-x-4">
                    {actions
                      ?.filter((action) => {
                        return !action?.disableOn?.some((disable) => {
                          return row?.[disable?.accessorKey] === disable?.value;
                        });
                      })
                      .map((action) => (
                        <button
                          key={action?.name}
                          type="button"
                          onClick={() => action?.handler?.(row)}
                        >
                          <action.Icon
                            className={`text-xl ${
                              action?.name === "delete"
                                ? " text-red-500"
                                : "text-primary"
                            }`}
                          />
                        </button>
                      ))}
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="py-5 flex items-center justify-center"
            >
              <span className="loading loading-spinner text-tertiary loading-lg"></span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

/* <===================================== Props Types ===================================> */

Table.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessorKey: PropTypes.string.isRequired,
      "data-label": PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
      disableOn: PropTypes.arrayOf(
        PropTypes.shape({
          accessorKey: PropTypes.string.isRequired,
          value: PropTypes.any,
        })
      ),
      Icon: PropTypes.elementType.isRequired,
    })
  ),
};
