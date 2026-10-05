"use client";

import { useReducer, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { checkoutReducer, initialCheckoutState } from "../state";
import { useGetUserQuery } from "@/redux/apis/authApis";
import { useGetOrderByUserIdQuery } from "@/redux/apis/orderApis";
import { sampleUsers } from "@/features/users/data";
import { getFromLocalStorage, setToLocalStorage } from "@/helpers/local-storage";
import { localDBKey } from "@/constants/localDBKey";

/**
 * Custom React integration hook for managing the multi-step checkout state.
 * Takes customer shipping details directly from localDB (localStorage) first,
 * with seamless fallback to live backend auth, past orders, and sample catalog.
 */
export default function useCheckoutState() {
  const { user } = useSelector((state) => state.auth);
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);

  // Fetch live user info from backend
  const { data: userInfoData } = useGetUserQuery(undefined, {
    skip: !user,
  });

  // Check recent orders for previously used shipping address if available
  const { data: userOrders } = useGetOrderByUserIdQuery(
    { user_id: user?.id },
    { skip: !user?.id }
  );

  // 1. Initial hydration directly from localDB (instant client prefill)
  useEffect(() => {
    try {
      // Priority 1: Check previously saved checkout shipping in localDB
      const savedShippingRaw = getFromLocalStorage(localDBKey.shippingInfo);
      if (savedShippingRaw) {
        const savedShipping =
          typeof savedShippingRaw === "string"
            ? JSON.parse(savedShippingRaw)
            : savedShippingRaw;
        if (savedShipping?.recipient_name || savedShipping?.email) {
          dispatch({
            type: "SET_ALL_SHIPPING_INFO",
            payload: savedShipping,
          });
          return;
        }
      }

      // Priority 2: Check logged-in user stored in localDB
      const savedUserRaw = getFromLocalStorage(localDBKey.user);
      if (savedUserRaw) {
        const savedUser =
          typeof savedUserRaw === "string"
            ? JSON.parse(savedUserRaw)
            : savedUserRaw;
        const profile = savedUser?.profile || {};
        const localShipping = {
          recipient_name: profile.name || savedUser?.name || "",
          email: savedUser?.email || "",
          phone: profile.phone || savedUser?.phone || "",
          address: profile.address || savedUser?.address || "",
          apartment: profile.apartment || savedUser?.apartment || "",
          city: profile.city || savedUser?.city || "",
          state: profile.state || savedUser?.state || "",
          country: profile.country || savedUser?.country || "United States",
          postal_code:
            profile.postcode ||
            profile.postal_code ||
            savedUser?.postcode ||
            savedUser?.postal_code ||
            "",
        };
        if (localShipping.recipient_name || localShipping.email) {
          dispatch({
            type: "SET_ALL_SHIPPING_INFO",
            payload: localShipping,
          });
        }
      }
    } catch (e) {
      // Non-blocking parse error
    }
  }, []);

  // 2. Resolved Customer Shipping Profile (merging localDB, remote user query & catalog)
  const resolvedCustomerShipping = useMemo(() => {
    if (!user) return null;

    // Check localDB cached records
    let localSavedShipping = null;
    let localSavedUser = null;
    try {
      const s = getFromLocalStorage(localDBKey.shippingInfo);
      if (s) localSavedShipping = typeof s === "string" ? JSON.parse(s) : s;
      const u = getFromLocalStorage(localDBKey.user);
      if (u) localSavedUser = typeof u === "string" ? JSON.parse(u) : u;
    } catch (e) {}

    const localProfile = localSavedUser?.profile || {};
    const remoteUser =
      userInfoData?.data?.user || userInfoData?.data || userInfoData || {};
    const remoteProfile = remoteUser.profile || {};
    const authProfile = user.profile || {};

    const matchedSample = sampleUsers.find(
      (u) =>
        (u.email &&
          user.email &&
          u.email.toLowerCase() === user.email.toLowerCase()) ||
        u.id === user.id
    );
    const sampleProfile = matchedSample?.profile || {};

    const ordersList = Array.isArray(userOrders?.data) ? userOrders.data : [];
    const lastOrder =
      ordersList.length > 0 ? ordersList[ordersList.length - 1] : null;
    const lastShipping = lastOrder?.shipping_info || {};

    return {
      recipient_name:
        localSavedShipping?.recipient_name ||
        localProfile.name ||
        localSavedUser?.name ||
        remoteProfile.name ||
        remoteUser.name ||
        authProfile.name ||
        user.name ||
        sampleProfile.name ||
        matchedSample?.name ||
        lastShipping.recipient_name ||
        "",
      email:
        localSavedShipping?.email ||
        localSavedUser?.email ||
        remoteUser.email ||
        user.email ||
        matchedSample?.email ||
        lastShipping.email ||
        "",
      phone:
        localSavedShipping?.phone ||
        localProfile.phone ||
        localSavedUser?.phone ||
        remoteProfile.phone ||
        remoteUser.phone ||
        authProfile.phone ||
        user.phone ||
        sampleProfile.phone ||
        lastShipping.phone ||
        "",
      address:
        localSavedShipping?.address ||
        localProfile.address ||
        localSavedUser?.address ||
        remoteProfile.address ||
        remoteUser.address ||
        authProfile.address ||
        user.address ||
        sampleProfile.address ||
        lastShipping.address ||
        "",
      apartment:
        localSavedShipping?.apartment ||
        localProfile.apartment ||
        localSavedUser?.apartment ||
        remoteProfile.apartment ||
        remoteUser.apartment ||
        authProfile.apartment ||
        user.apartment ||
        sampleProfile.apartment ||
        lastShipping.apartment ||
        "",
      city:
        localSavedShipping?.city ||
        localProfile.city ||
        localSavedUser?.city ||
        remoteProfile.city ||
        remoteUser.city ||
        authProfile.city ||
        user.city ||
        sampleProfile.city ||
        lastShipping.city ||
        "",
      state:
        localSavedShipping?.state ||
        localProfile.state ||
        localSavedUser?.state ||
        remoteProfile.state ||
        remoteUser.state ||
        authProfile.state ||
        user.state ||
        sampleProfile.state ||
        lastShipping.state ||
        "",
      country:
        localSavedShipping?.country ||
        localProfile.country ||
        localSavedUser?.country ||
        remoteProfile.country ||
        remoteUser.country ||
        authProfile.country ||
        user.country ||
        sampleProfile.country ||
        lastShipping.country ||
        "United States",
      postal_code:
        localSavedShipping?.postal_code ||
        localProfile.postcode ||
        localProfile.postal_code ||
        localSavedUser?.postcode ||
        localSavedUser?.postal_code ||
        remoteProfile.postcode ||
        remoteProfile.postal_code ||
        remoteUser.postcode ||
        remoteUser.postal_code ||
        authProfile.postcode ||
        authProfile.postal_code ||
        user.postcode ||
        user.postal_code ||
        sampleProfile.postcode ||
        sampleProfile.postal_code ||
        lastShipping.postal_code ||
        "",
      carrier: "Standard Expedited Carrier",
      delivery_instruction: state.shipping_info.delivery_instruction || "",
    };
  }, [user, userInfoData, userOrders, state.shipping_info.delivery_instruction]);

  // Pre-fill shipping info when customer data is resolved
  useEffect(() => {
    if (user?.id) {
      dispatch({ type: "SET_USER_ID", payload: user.id });
    }

    if (resolvedCustomerShipping) {
      dispatch({
        type: "SET_ALL_SHIPPING_INFO",
        payload: resolvedCustomerShipping,
      });
      // Synchronize back to localDB
      try {
        setToLocalStorage(localDBKey.shippingInfo, resolvedCustomerShipping);
      } catch (e) {}
    }
  }, [user?.id, resolvedCustomerShipping]);

  const setStep = (step) => dispatch({ type: "SET_STEP", payload: step });
  const nextStep = () => dispatch({ type: "NEXT_STEP" });
  const prevStep = () => dispatch({ type: "PREV_STEP" });

  const updateShippingField = (field, value) => {
    dispatch({
      type: "UPDATE_SHIPPING_INFO",
      payload: { field, value },
    });
    try {
      const updated = { ...state.shipping_info, [field]: value };
      setToLocalStorage(localDBKey.shippingInfo, updated);
    } catch (e) {}
  };

  const updateAllShippingInfo = (info) => {
    dispatch({
      type: "SET_ALL_SHIPPING_INFO",
      payload: info,
    });
    try {
      const updated = { ...state.shipping_info, ...info };
      setToLocalStorage(localDBKey.shippingInfo, updated);
    } catch (e) {}
  };

  const resetCheckout = () => dispatch({ type: "RESET_CHECKOUT" });

  return {
    state,
    formData: state,
    dispatch,
    currentStep: state.step,
    setStep,
    nextStep,
    prevStep,
    updateShippingField,
    updateAllShippingInfo,
    resetCheckout,
  };
}
