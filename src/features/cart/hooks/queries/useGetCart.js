"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetCartByEmailQuery } from "@/redux/apis/cartApis";
import { errorHandler } from "@/helpers/errorHandler";
import { CartService } from "../../services";

/**
 * Custom query hook to fetch the current user's cart.
 */
export default function useGetCart(options = {}) {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const queryResult = useGetCartByEmailQuery(
    { user_id: userId },
    { skip: !userId, ...options }
  );

  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const rawCartItems = data?.data || [];
  const cartSubtotal = CartService.calculateSubtotal(rawCartItems);
  const totalItemCount = CartService.calculateTotalQuantity(rawCartItems);

  return {
    cartItems: rawCartItems,
    cartSubtotal,
    totalItemCount,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
