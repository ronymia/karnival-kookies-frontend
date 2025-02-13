"use client";
import PropTypes from "prop-types";
import useDeviceWith from "@/Hooks/useDeviceWith";

export default function Table({
  rows = [],
  columns = [],
  isLoading = false,
  actions = [],
}) {
  const windowInnerWidth = useDeviceWith();

  // console.log({ rows });
  // const rows = [
  //   {
  //     name: "John Doe",
  //     position: "Software Engineer",
  //     salary: "$4,500",
  //     hoursWorked: 160,
  //     overtimeHours: 10,
  //     totalPay: "$5,000",
  //   },
  //   {
  //     name: "Jane Smith",
  //     position: "Project Manager",
  //     salary: "$5,000",
  //     hoursWorked: 160,
  //     overtimeHours: 5,
  //     totalPay: "$5,500",
  //   },
  //   {
  //     name: "Michael Brown",
  //     position: "Data Analyst",
  //     salary: "$4,000",
  //     hoursWorked: 160,
  //     overtimeHours: 8,
  //     totalPay: "$4,800",
  //   },
  //   {
  //     name: "Emily Johnson",
  //     position: "UX Designer",
  //     salary: "$4,200",
  //     hoursWorked: 160,
  //     overtimeHours: 6,
  //     totalPay: "$4,620",
  //   },
  // ];

  // const columns = [
  //   {
  //     header: "Name",
  //     "data-label": "Name",
  //     accessorKey: "name",
  //   },
  //   {
  //     header: "Position",
  //     "data-label": "Position",
  //     accessorKey: "position",
  //   },
  //   {
  //     header: "Salary",
  //     "data-label": "Salary",
  //     accessorKey: "salary",
  //   },
  //   {
  //     header: "Hours Worked",
  //     "data-label": "Hours Worked",
  //     accessorKey: "hoursWorked",
  //   },
  //   {
  //     header: "Overtime Hours",
  //     "data-label": "Overtime Hours",
  //     accessorKey: "overtimeHours",
  //   },
  //   {
  //     header: "Total Pay",
  //     "data-label": "Total Pay",
  //     accessorKey: "totalPay",
  //   },
  // ];

  // const handleEdit = () => {};
  // const handleDelete = () => {};

  // const actions = [
  //   {
  //     name: "Edit",
  //     handler: handleEdit,
  //     Icon: RiEdit2Fill,
  //     disableOn: [
  //       {
  //         accessorKey: "hoursWorked",
  //         value: 1,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Delete",
  //     handler: handleDelete,
  //     Icon: MdDelete,
  //     disableOn: [
  //       {
  //         accessorKey: "hoursWorked",
  //         value: 1,
  //       },
  //     ],
  //   },
  // ];

  return (
    <table className="w-full">
      {/* <===================================== Table Header ===================================> */}
      <thead className="h-16 hidden md:table-header-group bg-primary text-base-300 px-3">
        <tr className=" border-b border-primary-content ">
          {columns.map((col) => (
            <th
              colSpan={col.accessorKey === "actions" ? actions.length : 1}
              align="left"
              key={col.accessorKey}
              className="font-medium p-2"
            >
              {col.header}
            </th>
          ))}
          {actions.length > 0 && (
            <th
              key="actions"
              colSpan={actions.length}
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
          rows.map((row) => (
            <tr
              key={row.name}
              className="block md:table-row border md:border-0 md:border-b border-primary-content bg-secondary md:hover:bg-primary-content md:hover:text-secondary text-sm font-bold mb-4 md:mb-0 p-4 md:p-0 rounded-lg"
            >
              {/* <===================================== Action for Mobile ====================================> */}
              {windowInnerWidth < 768 && actions.length > 0 && (
                <td
                  colSpan={columns.length + 1}
                  className="w-full p-2 flex items-center justify-center"
                >
                  {actions
                    .filter((action) => {
                      return !action.disableOn?.some((disable) => {
                        return row[disable?.accessorKey] === disable?.value;
                      });
                    })
                    .map((action) => (
                      <button
                        key={action.name}
                        type="button"
                        onClick={() => action?.handler(row)}
                      >
                        <action.Icon
                          className={`text-xl ${
                            action.name === "delete"
                              ? " text-red-500"
                              : "text-primary"
                          }`}
                        />
                      </button>
                    ))}
                </td>
              )}

              {/* <===================================== Table Columns ===================================> */}
              {columns.map((col) => (
                <td
                  key={col.accessorKey}
                  data-label={col["data-label"]}
                  className="block md:table-cell py-3 md:py-4 px-3 border md:border-none border-gray-200"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-normal md:hidden">
                      {col["data-label"]}
                    </span>
                    <span>{row[col.accessorKey]}</span>
                  </div>
                </td>
              ))}

              {/* <===================================== Action for Desktop ==================================> */}
              {windowInnerWidth > 768 && actions.length > 0 && (
                <td className="hidden md:table-cell text-right p-2 pr-6">
                  <div className="flex justify-end space-x-4">
                    {actions
                      .filter((action) => {
                        return !action.disableOn?.some((disable) => {
                          return row[disable?.accessorKey] === disable?.value;
                        });
                      })
                      .map((action) => (
                        <button
                          key={action.name}
                          type="button"
                          onClick={() => action?.handler(row)}
                        >
                          <action.Icon
                            className={`text-xl ${
                              action.name === "delete"
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
            <td className="text-center py-5">
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
