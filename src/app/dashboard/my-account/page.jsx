"use client";
import Heading from "@/components/ui/heading/Heading";
import { formatRole } from "@/utils/formatRole";
import { useSelector } from "react-redux";

export default function Page() {
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <div className={`max-w-screen-xl mx-auto px-3 space-y-10 pt-36 pb-40`}>
        <div data-auto="container-personal-details" className="w-full">
          {/* HEADING */}
          <div
            id="header"
            className="pb-7 flex justify-between items-center w-full"
          >
            <Heading isSubHeading={false} heading={"Personal Details"} />
          </div>
          {/* MAIN */}
          <div className="space-y-5">
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Name: </span>
              <span className="text-base-300">{formatRole(user?.name)}</span>
            </div>
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Email: </span>
              <span className="text-base-300">{user?.email}</span>
            </div>
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Phone Number: </span>
              <span className="text-base-300">{user?.phone}</span>
            </div>
            <div className={`text-xl space-x-2`}>
              <span className={` font-bold text-primary`}>Role: </span>
              <span className="text-base-300">{formatRole(user?.role)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
