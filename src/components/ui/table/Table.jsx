"use client";

import PropTypes from "prop-types";
import { FiInbox } from "react-icons/fi";
import useDeviceWidth from "@/hooks/useDeviceWidth";
import Pagination from "./Pagination";

export default function Table({
  rows = [],
  bodyData,
  columns = [],
  headerData,
  isLoading = false,
  actions = [],
  emptyMessage = "No records found",
  wrapperClassName = "",
  pagination,
}) {
  const windowInnerWidth = useDeviceWidth();
  const isMobile = windowInnerWidth < 768;

  // Support both rows/columns and bodyData/headerData conventions
  const finalRows = rows && rows.length > 0 ? rows : bodyData || [];
  const finalColumns =
    columns && columns.length > 0 ? columns : headerData || [];

  // LOADING SKELETON
  if (isLoading) {
    return (
      <div
        className={`w-full rounded-3xl bg-[#161311]/90 border border-primary/20 backdrop-blur-xl shadow-2xl p-6 space-y-4 animate-pulse ${wrapperClassName}`}
      >
        <div className="h-10 bg-white/5 rounded-xl w-full" />
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-14 bg-white/[0.02] rounded-xl w-full" />
        ))}
      </div>
    );
  }

  // EMPTY STATE
  if (!finalRows || finalRows.length === 0) {
    return (
      <div
        className={`w-full rounded-3xl bg-[#161311]/90 border border-primary/20 backdrop-blur-xl shadow-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 ${wrapperClassName}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center text-2xl">
          <FiInbox />
        </div>
        <h4 className="font-serif text-xl text-white font-medium">
          {emptyMessage}
        </h4>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm">
          No items to display at this time.
        </p>
      </div>
    );
  }

  // PAGINATION METRICS
  let paginationInfo = null;
  if (pagination) {
    const page = Number(
      pagination.currentPage ||
        pagination.page ||
        pagination.filters?.page ||
        1
    );
    const limit = Number(
      pagination.pageSize ||
        pagination.perPage ||
        pagination.filters?.limit ||
        pagination.filters?.perPage ||
        10
    );
    const total =
      pagination.total !== undefined
        ? Number(pagination.total)
        : finalRows.length;

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    paginationInfo = { page, limit, total, start, end };
  }

  return (
    <div
      className={`w-full rounded-3xl bg-[#161311]/90 border border-primary/20 backdrop-blur-xl shadow-2xl overflow-hidden ${wrapperClassName}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* TABLE HEADER */}
          <thead className="hidden md:table-header-group bg-white/[0.04] border-b border-primary/20">
            <tr>
              {finalColumns?.map((col) => (
                <th
                  key={col?.accessorKey}
                  className="py-4 px-5 text-[11px] uppercase tracking-wider text-primary font-semibold"
                >
                  {col?.header}
                </th>
              ))}
              {actions?.length > 0 && (
                <th className="py-4 px-6 text-right text-[11px] uppercase tracking-wider text-primary font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="block w-full md:table-row-group divide-y divide-white/5 text-xs sm:text-sm">
            {finalRows?.map((row, rowIndex) => {
              const rowKey = row.id || row.key || rowIndex;

              return (
                <tr
                  key={rowKey}
                  className="block md:table-row hover:bg-white/[0.03] transition-colors duration-150 p-4 md:p-0 mb-3 md:mb-0 rounded-2xl md:rounded-none border border-white/10 md:border-0"
                >
                  {/* DESKTOP / MOBILE COLUMNS */}
                  {finalColumns?.map((col) => (
                    <td
                      key={col?.accessorKey}
                      data-label={col?.header}
                      className="block md:table-cell py-2 md:py-4 px-3 md:px-5 text-neutral-200"
                    >
                      <div className="flex justify-between items-center md:block">
                        <span className="font-semibold uppercase tracking-wider text-[11px] text-primary/80 md:hidden">
                          {col?.header}
                        </span>
                        <div className="text-right md:text-left text-neutral-200">
                          {row?.[col?.accessorKey] ?? "—"}
                        </div>
                      </div>
                    </td>
                  ))}

                  {/* ACTION CONTROLS */}
                  {actions?.length > 0 && (
                    <td className="block md:table-cell py-3 md:py-4 px-3 md:px-6 text-right border-t md:border-t-0 border-white/5 mt-2 md:mt-0">
                      <div className="flex items-center justify-end gap-2">
                        {actions
                          ?.filter((action) => {
                            return !action?.disableOn?.some((disable) => {
                              return (
                                row?.[disable?.accessorKey] === disable?.value
                              );
                            });
                          })
                          .map((action) => {
                            const isDelete = action?.name === "delete";
                            const isEdit = action?.name === "edit";

                            const buttonClass = isDelete
                              ? "p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/25 transition-all cursor-pointer shadow-sm"
                              : isEdit
                              ? "p-2 rounded-xl bg-primary/10 hover:bg-primary hover:text-black text-primary border border-primary/25 transition-all cursor-pointer shadow-sm"
                              : "p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-200 border border-white/10 transition-all cursor-pointer shadow-sm";

                            return (
                              <button
                                key={action?.name}
                                type="button"
                                title={action?.name}
                                onClick={() => action?.handler?.(row)}
                                className={buttonClass}
                              >
                                <action.Icon className="text-base" />
                              </button>
                            );
                          })}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* BUILT-IN PAGINATION FOOTER */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-primary/15 bg-white/[0.02]">
          {/* ENTRY COUNT METRICS */}
          <div className="text-xs text-neutral-400 font-medium">
            {paginationInfo ? (
              <p>
                Showing{" "}
                <span className="font-semibold text-white">
                  {paginationInfo.start}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-white">
                  {paginationInfo.end}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {paginationInfo.total}
                </span>{" "}
                entries
              </p>
            ) : null}
          </div>

          {/* PAGINATION CONTROLS */}
          <div>
            <Pagination {...pagination} />
          </div>
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  bodyData: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessorKey: PropTypes.string.isRequired,
      "data-label": PropTypes.string,
    })
  ),
  headerData: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessorKey: PropTypes.string.isRequired,
      "data-label": PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
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
  emptyMessage: PropTypes.string,
  wrapperClassName: PropTypes.string,
  pagination: PropTypes.shape({
    filters: PropTypes.object,
    setFilters: PropTypes.func,
    total: PropTypes.number,
    totalPage: PropTypes.number,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    perPage: PropTypes.number,
    onPageChange: PropTypes.func,
    className: PropTypes.string,
  }),
};
