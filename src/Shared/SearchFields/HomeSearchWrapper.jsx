"use client";

import { useRouter } from "next/navigation";
import SmallSearchField from "./SmallSearchField";

const HomeSearchWrapper = () => {
  const router = useRouter();

  const currentQuery = router.query;
  console.log({ currentQuery });
  const queryParams = new URLSearchParams(currentQuery);
  console.log({ queryParams });

  // Set or update the searchKey parameter
  //   queryParams.set("searchKey", searchKey);
  return (
    <div className={`md:flex justify-end px-5`}>
      <SmallSearchField
        handleChange={(e) => router.push(`?searchKey=${e.target.value}`)}
      />
    </div>
  );
};

export default HomeSearchWrapper;
