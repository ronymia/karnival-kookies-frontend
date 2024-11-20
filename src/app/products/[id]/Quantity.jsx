"use client";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Quantity = ({ quantity, setQuantity }) => {
  const handleQuantityDown = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <div className={`relative inline-block`}>
      <input
        className={`w-[100px] bg-base-100 border-base-300 border p-3 text-[20px] text-base-300 rounded-lg`}
        type="number"
        name="quantity"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <IoIosArrowUp
        onClick={() => setQuantity(quantity + 1)}
        className={`absolute top-2 right-2 font-bold text-base-300`}
      />
      <IoIosArrowDown
        onClick={handleQuantityDown}
        className={`absolute bottom-2 right-2 font-bold text-base-300`}
      />
    </div>
  );
};

export default Quantity;
