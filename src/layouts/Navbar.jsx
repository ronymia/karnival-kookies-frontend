"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { openCartDrawer } from "@/redux/features/cartSlice";
import { CartDrawer } from "@/features/cart";
import { CgShoppingCart } from "react-icons/cg";
import {
  FiAlignLeft,
  FiChevronDown,
  FiGrid,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import Logout from "@/components/layouts/Logout";
import useClickOutside from "@/hooks/useClickOutside";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

export default function Navbar() {
  const { user, isAdmin, isCustomer } = useAuth();
  const dispatch = useDispatch();
  const { totalQuantity } = useSelector((state) => state.cart || {});
  const [sidebar, setSidebar] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleCloseMenu = () => {
    setIsMobileExpanded("");
    setSidebar(false);
  };

  const isRouteActive = (path) => {
    if (!path || !pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // MENU LIST
  const menus = [
    {
      id: 1,
      name: "Home",
      path: "/",
      handler: handleCloseMenu,
      permission: true,
      Children: [],
    },
    {
      id: 2,
      name: "Shop",
      path: "/shop-product",
      handler: handleCloseMenu,
      permission: true,
      Children: [],
    },
    {
      id: 3,
      name: "Admin Panel",
      handler: handleCloseMenu,
      path: "/admin",
      permission: isAdmin,
      Children: [
        {
          id: 7,
          name: "Admin Dashboard",
          path: "/admin/dashboard",
          handler: handleCloseMenu,
        },
        {
          id: 1,
          name: "Products",
          path: "/admin/all-products",
          handler: handleCloseMenu,
        },
        {
          id: 2,
          name: "Categories",
          path: "/admin/categories",
          handler: handleCloseMenu,
        },
        {
          id: 8,
          name: "Packages",
          path: "/admin/packages",
          handler: handleCloseMenu,
        },
        {
          id: 6,
          name: "Orders",
          path: "/admin/orders",
          handler: handleCloseMenu,
        },
        {
          id: 5,
          name: "Users",
          path: "/admin/users",
          handler: handleCloseMenu,
        },
        {
          id: 10,
          name: "Campaigns",
          path: "/admin/campaigns",
          handler: handleCloseMenu,
        },
        {
          id: 3,
          name: "Coupon Codes",
          path: "/admin/coupon-codes",
          handler: handleCloseMenu,
        },
        {
          id: 4,
          name: "FAQ",
          path: "/admin/faq",
          handler: handleCloseMenu,
        },
        {
          id: 9,
          name: "Meta Data",
          path: "/admin/meta-data",
          handler: handleCloseMenu,
        },
      ],
    },
    {
      id: 4,
      name: "Contacts",
      path: "/contact-us",
      handler: handleCloseMenu,
      permission: true,
      Children: [],
    },
  ];

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 w-full bg-[#0b0a0b]/85 backdrop-blur-xl border-b border-primary/20 shadow-xl shadow-black/40 transition-all">
        <div className="w-full px-4 sm:px-8 xl:px-14 h-20 flex items-center justify-between relative">
          {/* LEFT: DESKTOP LOGO / MOBILE HAMBURGER */}
          <div className="flex items-center gap-3">
            {/* MOBILE HAMBURGER BUTTON (LEFT ON MOBILE) */}
            <button
              type="button"
              onClick={() => setSidebar(true)}
              className="xl:hidden p-2 rounded-full text-primary hover:bg-primary/10 transition-colors cursor-pointer border border-primary/25 flex items-center justify-center focus:outline-hidden"
              aria-label="Open Navigation Menu"
            >
              <FiAlignLeft className="text-2xl" />
            </button>

            {/* DESKTOP LOGO (LEFT ON DESKTOP) */}
            <Link
              href="/"
              className="hidden xl:flex items-center gap-3 group transition-transform duration-200 hover:scale-105"
              aria-label="Karnival Kookies Home"
            >
              <Image
                className="w-14 sm:w-16 h-auto drop-shadow-[0_2px_12px_rgba(210,152,44,0.3)]"
                src="/cremeLogo.png"
                alt="Karnival Kookies logo"
                width={100}
                height={100}
                priority
                loading="eager"
              />
            </Link>
          </div>

          {/* CENTER: MOBILE LOGO (CENTERED ON MOBILE) */}
          <Link
            href="/"
            className="xl:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 hover:scale-105 pointer-events-auto"
            aria-label="Karnival Kookies Home"
          >
            <Image
              className="w-12 sm:w-14 h-auto drop-shadow-[0_2px_12px_rgba(210,152,44,0.3)]"
              src="/cremeLogo.png"
              alt="Karnival Kookies logo"
              width={100}
              height={100}
              priority
              loading="eager"
            />
          </Link>

          {/* CENTER: DESKTOP NAVIGATION PILL (CENTERED ON DESKTOP) */}
          <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center">
            <ul className="flex items-center gap-1.5 bg-[#171412]/80 border border-primary/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner shadow-black/60">
              {menus?.map((menu) => {
                if (!menu?.permission) return null;
                const active = isRouteActive(menu.path);

                if (menu?.Children?.length > 0) {
                  return (
                    <DesktopNavDropdown
                      key={menu.id}
                      icon={menu?.Icon}
                      label={menu?.name}
                      isActive={active}
                    >
                      {menu?.Children?.map((child) => {
                        const childActive = pathname === child.path;
                        return (
                          <DesktopDropdownItem
                            key={child.id || child.path}
                            icon={child?.Icon}
                            href={child?.path}
                            handler={child?.handler}
                            isActive={childActive}
                          >
                            {child?.name}
                          </DesktopDropdownItem>
                        );
                      })}
                    </DesktopNavDropdown>
                  );
                }

                return (
                  <DesktopNavItem
                    key={menu.id}
                    icon={menu?.Icon}
                    href={menu?.path}
                    handler={menu?.handler}
                    isActive={active}
                  >
                    {menu?.name}
                  </DesktopNavItem>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: CART & USER PROFILE */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* CART BUTTON (CUSTOMER ROLE ONLY) */}
            {isCustomer && (
              <button
                type="button"
                onClick={() => dispatch(openCartDrawer())}
                className="relative p-2.5 rounded-full bg-primary/10 border border-primary/25 text-primary hover:border-primary hover:bg-primary/20 hover:scale-105 transition-all flex items-center justify-center cursor-pointer group shadow-xs"
                aria-label="Open Shopping Bag"
              >
                <CgShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-gradient-to-r from-primary to-amber-500 text-black font-bold text-[11px] rounded-full flex items-center justify-center shadow-md shadow-primary/30 animate-pulse">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                )}
              </button>
            )}

            {/* USER PROFILE DROPDOWN OR AUTH BUTTONS */}
            {user ? (
              <ProfileDropdown user={user} isAdmin={isAdmin} />
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="hidden sm:flex px-5 py-2 bg-transparent hover:bg-primary/10 text-white hover:text-primary rounded-full font-bold text-sm border border-primary/25 transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="hidden sm:flex px-5 py-2 bg-primary text-black font-bold text-sm hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 rounded-full transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR DRAWER (SIBLING TO NAV) */}
      <AnimatePresence>
        {sidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebar(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 bottom-0 left-0 w-[300px] sm:w-[340px] h-screen bg-[#110f0e] border-r border-primary/25 z-[1000] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 flex justify-between items-center border-b border-primary/15 bg-[#171412]">
                <div className="flex items-center gap-2.5">
                  <Image
                    className="w-12 h-auto drop-shadow-md"
                    src="/cremeLogo.png"
                    alt="logo"
                    width={100}
                    height={100}
                  />
                  <span className="font-bold text-lg text-primary tracking-wide">
                    Karnival Kookies
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebar(false)}
                  className="p-2 rounded-full text-primary hover:bg-primary/15 transition-colors cursor-pointer border border-primary/20"
                  aria-label="Close Sidebar"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Mobile Navigation Menu */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {menus?.map((menu) => {
                    if (!menu?.permission) return null;
                    const active = isRouteActive(menu.path);

                    if (menu?.Children?.length > 0) {
                      return (
                        <MobileNavDropdown
                          key={menu.id}
                          icon={menu?.Icon}
                          label={menu?.name}
                          isExpanded={isMobileExpanded}
                          setIsExpanded={setIsMobileExpanded}
                          isActive={active}
                        >
                          {menu?.Children?.map((child) => {
                            const childActive = pathname === child.path;
                            return (
                              <MobileNavItem
                                key={child.id || child.path}
                                icon={child?.Icon}
                                href={child?.path}
                                handler={() => {
                                  child?.handler?.();
                                  setSidebar(false);
                                }}
                                isActive={childActive}
                              >
                                {child?.name}
                              </MobileNavItem>
                            );
                          })}
                        </MobileNavDropdown>
                      );
                    }

                    return (
                      <MobileNavItem
                        key={menu.id}
                        icon={menu?.Icon}
                        href={menu?.path}
                        handler={() => {
                          menu?.handler?.();
                          setSidebar(false);
                        }}
                        isActive={active}
                      >
                        {menu?.name}
                      </MobileNavItem>
                    );
                  })}
                </ul>
              </nav>

              {/* Mobile Guest Auth Buttons */}
              {!user && (
                <div className="p-4 border-t border-primary/15 bg-[#171412] flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/login");
                      setSidebar(false);
                    }}
                    className="flex-1 py-2.5 bg-transparent text-white hover:text-primary rounded-xl font-bold text-sm border border-primary/20 text-center cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/register");
                      setSidebar(false);
                    }}
                    className="flex-1 py-2.5 bg-primary text-black rounded-xl font-bold text-sm text-center hover:brightness-110 cursor-pointer shadow-md"
                  >
                    Register
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <CartDrawer />
    </>
  );
}

/* <================================ DESKTOP NAV COMPONENTS ================================> */
function DesktopNavItem({ icon, href, handler, children, isActive }) {
  return (
    <li>
      <Link
        href={href}
        onClick={handler}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isActive
            ? "text-primary bg-primary/15 border border-primary/30 shadow-xs shadow-primary/15 font-semibold"
            : "text-white/90 hover:text-primary hover:bg-primary/10 border border-transparent"
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}

DesktopNavItem.propTypes = {
  icon: PropTypes.node,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  handler: PropTypes.func,
  isActive: PropTypes.bool,
};

function DesktopNavDropdown({ icon, label, children, isActive }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  return (
    <li ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          isActive || isOpen
            ? "text-primary bg-primary/15 border border-primary/30 shadow-xs shadow-primary/15 font-semibold"
            : "text-white/90 hover:text-primary hover:bg-primary/10 border border-transparent"
        }`}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </span>
        <FiChevronDown
          className={`text-sm transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-white/70"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl bg-[#141210]/95 backdrop-blur-xl border border-primary/25 shadow-2xl shadow-black/80 p-2 z-200"
          >
            <ul className="space-y-1">{children}</ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

DesktopNavDropdown.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  isActive: PropTypes.bool,
};

function DesktopDropdownItem({ icon, href, handler, children, isActive }) {
  return (
    <li>
      <Link
        href={href}
        onClick={handler}
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? "bg-primary/20 text-primary font-semibold border border-primary/30"
            : "text-white/90 hover:text-primary hover:bg-primary/10 hover:translate-x-1"
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}

DesktopDropdownItem.propTypes = {
  icon: PropTypes.node,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  handler: PropTypes.func,
  isActive: PropTypes.bool,
};

/* <================================ MOBILE NAV COMPONENTS ================================> */
function MobileNavItem({ icon, href, handler, children, isActive }) {
  return (
    <li>
      <Link
        href={href}
        onClick={handler}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
          isActive
            ? "bg-primary/15 text-primary border border-primary/30 font-semibold shadow-xs"
            : "text-white/90 hover:text-primary hover:bg-primary/10"
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}

MobileNavItem.propTypes = {
  icon: PropTypes.node,
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
  handler: PropTypes.func,
  isActive: PropTypes.bool,
};

function MobileNavDropdown({
  icon,
  label,
  children,
  isExpanded,
  setIsExpanded,
  isActive,
}) {
  const isCurrentlyExpanded = isExpanded === label;

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => setIsExpanded(isCurrentlyExpanded ? "" : label)}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer ${
          isActive || isCurrentlyExpanded
            ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
            : "text-white/90 hover:text-primary hover:bg-primary/10"
        }`}
        aria-expanded={isCurrentlyExpanded}
      >
        <span className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </span>
        <motion.span
          animate={{ rotate: isCurrentlyExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <FiChevronDown className="text-lg" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isCurrentlyExpanded && (
          <motion.ul
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="ml-4 pl-3 border-l border-primary/20 mt-1 space-y-1 overflow-hidden py-1"
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

MobileNavDropdown.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  isExpanded: PropTypes.string,
  setIsExpanded: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

/* <================================ PROFILE DROPDOWN COMPONENT ================================> */
function ProfileDropdown({ user, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
    : "U";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 text-primary font-bold text-base flex items-center justify-center hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all cursor-pointer focus:outline-hidden overflow-hidden"
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user?.name || "User Avatar"}
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="tracking-wide">{initials}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#141210]/95 backdrop-blur-xl border border-primary/25 shadow-2xl shadow-black/80 p-2.5 z-200 overflow-hidden"
          >
            {/* USER INFO HEADER */}
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/15 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* MENU LINKS */}
            <div className="space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-white/90 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              >
                <FiGrid className="text-primary text-base" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/order-history"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-white/90 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              >
                <FiShoppingBag className="text-primary text-base" />
                <span>My Orders</span>
              </Link>

              <Link
                href="/dashboard/my-account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-white/90 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              >
                <FiUser className="text-primary text-base" />
                <span>Profile</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-white/90 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                >
                  <FiShield className="text-primary text-base" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>

            {/* LOGOUT */}
            <div className="pt-2 mt-2 border-t border-primary/15">
              <Logout />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

ProfileDropdown.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    role: PropTypes.string,
  }),
  isAdmin: PropTypes.bool,
};
