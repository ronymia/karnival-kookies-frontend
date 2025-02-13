"use client";

import { useRouter } from "next/navigation";
import SmallSearchField from "./SmallSearchField";

const HomeSearchWrapper = () => {
  const router = useRouter();

  return (
    <div className={`md:flex justify-end px-5`}>
      <SmallSearchField
        handleChange={(e) => router.push(`?searchTerm=${e.target.value}`)}
      />
    </div>
  );
};

/* <-------------------------------------------- PROP TYPES DEFINE --------------------------------------> */
// HomeSearchWrapper.propTypes = {

// }
export default HomeSearchWrapper;
