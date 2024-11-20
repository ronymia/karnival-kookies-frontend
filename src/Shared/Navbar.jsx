"use client";
import { useAuthContext } from "@/Context/ProjectProvider";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { FiAlignLeft, FiX } from "react-icons/fi";
import { MdChevronRight } from "react-icons/md";
import { OutsideClickHandler } from "./OutsideClickHandler";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuthContext();
  console.log({ user });
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState("");
  const [openDropdown, seOpenDropdown] = useState(false);

  const handleLogin = () => {
    router.push("/login");
    setSidebar(false);
  };
  const handleRegister = () => {
    router.push("/register");
    setSidebar(false);
  };
  const handleCloseMenu = () => {
    setIsExpanded("");
    setSidebar(false);
  };

  const handleOpenDropdown = () => {
    seOpenDropdown(!openDropdown);
  };

  const menus = [
    {
      id: 1,
      name: "Home",
      path: "/",
      // Icon: <Home className="h-4 w-4" />,
      handler: handleCloseMenu,
      permission: true,
      Children: [],
    },
    {
      id: 2,
      name: "Product",
      path: "/products",
      // Icon: <ShoppingBag className="h-4 w-4" />,
      handler: handleCloseMenu,
      permission: true,
      Children: [
        {
          id: 1,
          name: "Shop",
          path: "/products",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
      ],
    },
    {
      id: 3,
      name: "Account",
      path: "/dashboard",
      // Icon: <ShoppingBag className="h-4 w-4" />,
      handler: handleCloseMenu,
      permission: user,
      Children: [
        {
          id: 1,
          name: "Dashboard",
          path: "/dashboard/my-account",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 2,
          name: "My Orders",
          path: "/dashboard/order-history",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
      ],
    },

    {
      id: 4,
      name: "Admin Panel",
      // Icon: <LayoutDashboard className="h-4 w-4" />,
      handler: handleOpenDropdown,
      path: "/admin",
      permission: isAdmin,
      Children: [
        {
          id: 7,
          name: "Admin Dashboard",
          path: "/admin/dashboard",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 1,
          name: "Products",
          path: "/admin/all-products",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 2,
          name: "Categories",
          path: "/admin/categories",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 6,
          name: "Orders",
          path: "/admin/orders",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 5,
          name: "Users",
          path: "/admin/users",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 3,
          name: "Messages",
          path: "/admin/messages",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
        {
          id: 4,
          name: "FAQ",
          path: "/admin/faq",
          // Icon: <Tag className="h-4 w-4" />,
          handler: handleCloseMenu,
        },
      ],
    },
    {
      id: 5,
      name: "Contacts",
      path: "/contact-us",
      // Icon: <Home className="h-4 w-4" />,
      handler: handleCloseMenu,
      permission: true,
      Children: [],
    },
  ];
  return (
    <div
      className={`h-32 w-full bg-transparent relative flex flex-col justify-center text-base-300 px-5 xl:px-20`}
    >
      <div className={`w-full px-3 mx-auto z-50`}>
        <div className={`flex justify-between items-center w-full `}>
          <img
            className={`w-20 h-auto hidden xl:block`}
            src="/cremeLogo.png"
            alt="logo"
          />
          <div
            className={`flex justify-between items-center gap-2 w-full xl:w-auto`}
          >
            <div onClick={() => setSidebar(true)} className={`xl:hidden `}>
              <FiAlignLeft className={`text-4xl text-primary `} />
            </div>
            <img
              className={`w-20 h-auto xl:hidden`}
              src="/cremeLogo.png"
              alt="logo"
            />
            <div className={`xl:hidden`}></div>
            <ul className="hidden xl:flex">
              {menus?.map((menu, i) =>
                menu?.permission ? (
                  menu?.Children?.length > 0 ? (
                    <NavItemWithChildren
                      key={i}
                      icon={menu?.Icon}
                      label={menu?.name}
                      isExpanded={isExpanded}
                      setIsExpanded={setIsExpanded}
                    >
                      {menu?.Children?.map((menu, i) => (
                        <NavItemForDesktop
                          key={i}
                          icon={menu?.Icon}
                          href={menu?.path}
                        >
                          {menu?.name}
                        </NavItemForDesktop>
                      ))}
                    </NavItemWithChildren>
                  ) : (
                    <NavItemForDesktop
                      key={i}
                      icon={menu?.Icon}
                      href={menu?.path}
                      handler={menu?.handler}
                    >
                      {menu?.name}
                    </NavItemForDesktop>
                  )
                ) : (
                  ""
                )
              )}
            </ul>
          </div>
          <div className={`flex items-center gap-6`}>
            <div
              onClick={() =>
                user ? router.push("/cart") : router.push("/login")
              }
              className={`p-3 rounded-full bg-transparent cursor-pointer`}
            >
              <CgShoppingCart className={`text-2xl font-bold text-primary`} />
            </div>
            {user ? (
              <button
                data-tip={`Sign Out`}
                onClick={logout}
                className={`tooltip tooltip-custom-primary tooltip-bottom items-center gap-1 hidden xl:flex px-3  sm:px-6 py-2 sm:py-3 bg-base-200 text-base-300 rounded-full font-bold `}
              >
                Logout
              </button>
            ) : (
              <div className={`flex items-center gap-3`}>
                <button
                  data-tip="Sign In"
                  onClick={() => router.push("/login")}
                  className={`tooltip  tooltip-custom-primary tooltip-bottom items-center gap-1 hidden xl:flex px-3 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-300 rounded-full font-bold `}
                >
                  Login
                </button>
                <button
                  data-tip="register"
                  onClick={() => router.push("/register")}
                  className={`tooltip tooltip-custom-primary tooltip-bottom items-center gap-1 hidden xl:flex px-3 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-300 rounded-full font-bold `}
                >
                  Register
                </button>
              </div>
            )}
          </div>
          <OutsideClickHandler
            onOutsideClick={() => {
              setSidebar(false);
            }}
            className={` h-screen bg-base-100 fixed transition-all ${
              sidebar ? "left-0" : "-left-[320px]"
            } bottom-0 top-0 shadow-xl z-[1000] overflow-y-auto`}
          >
            <div className="flex flex-col h-screen w-[320px] overflow-hidden bg-base-100 border-r ">
              <div className="p-4 flex justify-between items-center">
                <img
                  className={`w-20 h-auto`}
                  src="/cremeLogo.png"
                  alt="logo"
                />
                <FiX
                  onClick={() => setSidebar(false)}
                  className={`text-4xl m-5 p-2 rounded-full w-auto text-primary bg-secondary `}
                />
              </div>
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {menus?.map((menu, i) =>
                    menu?.permission ? (
                      menu?.Children?.length > 0 ? (
                        <NavItemWithChildren
                          key={i}
                          icon={menu?.Icon}
                          label={menu?.name}
                          isExpanded={isExpanded}
                          setIsExpanded={setIsExpanded}
                        >
                          {menu?.Children?.map((menu, i) => (
                            <NavItem
                              key={i}
                              icon={menu?.Icon}
                              href={menu?.path}
                              handler={menu?.handler}
                            >
                              {menu?.name}
                            </NavItem>
                          ))}
                        </NavItemWithChildren>
                      ) : (
                        <NavItem
                          key={i}
                          icon={menu?.Icon}
                          href={menu?.path}
                          handler={menu?.handler}
                        >
                          {menu?.name}
                        </NavItem>
                      )
                    ) : (
                      ""
                    )
                  )}
                </ul>
              </nav>
              <div className="p-4 border-t dark:border-gray-700 pb-5">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary ">
                      {user?.name
                        ?.split(" ")
                        ?.map((char) => char.charAt(0).toUpperCase())}
                    </span>
                  </div>
                  {user ? (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-heading-main ">
                        {user?.name}
                      </p>
                      <p className="text-xs font-semibold text-heading-main ">
                        {user?.email}
                      </p>
                    </div>
                  ) : (
                    <div className="ml-3 text-sm font-semibold text-heading-main">
                      Please{" "}
                      <span
                        className={`link link-hover hover:text-heading-brand`}
                        onClick={handleLogin}
                      >
                        Login
                      </span>{" "}
                      or{" "}
                      <span
                        className={`link link-hover hover:text-heading-brand`}
                        onClick={handleRegister}
                      >
                        Register
                      </span>
                    </div>
                  )}
                </div>

                {user ? (
                  <button
                    onClick={logout}
                    className="w-full mt-4 px-4 py-2 text-sm font-medium bg-transparent text-heading-main hover:text-gray-100 hover:bg-gray-700 rounded-md flex items-center justify-start"
                  >
                    Logout
                  </button>
                ) : (
                  <div className={`grid grid-cols-2 gap-3`}>
                    <button
                      onClick={handleLogin}
                      className="w-full mt-4 px-4 py-2 text-sm font-medium bg-transparent text-heading-main hover:text-gray-100 hover:bg-gray-700 rounded-md flex items-center justify-start"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleRegister}
                      className="w-full mt-4 px-4 py-2 text-sm font-medium bg-transparent text-heading-main hover:text-gray-100 hover:bg-gray-700 rounded-md flex items-center justify-start"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      </div>
      <div className={`w-full`}>
        <div className={`wavy-line-nav`}></div>
      </div>
    </div>
  );
};

export default Navbar;

function NavItem({ icon, href, children, handler }) {
  return (
    <li>
      <Link
        href={href}
        onClick={handler}
        className="flex items-center rounded-lg px-3 py-2 gap-2 font-semibold text-heading-main hover:text-gray-100 hover:bg-gray-700"
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}

function NavItemForDesktop({ icon, href, handler, children }) {
  return (
    <li onClick={handler}>
      <Link
        href={href}
        className="flex items-center px-3 py-2 gap-2 font-semibold text-heading-main hover:text-gray-100 hover:bg-gray-700"
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}

function NavItemWithChildren({
  icon,
  label,
  children,
  isExpanded,
  setIsExpanded,
}) {
  return (
    <li className={`relative`}>
      <button
        onClick={() => setIsExpanded(isExpanded === label ? "" : label)}
        className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-heading-main hover:text-gray-100 hover:bg-gray-700"
        aria-expanded={isExpanded === label}
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <motion.span
          animate={{ rotate: isExpanded === label ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <MdChevronRight className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded === label && (
          <motion.ul
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="ml-6 xl:ml-0 mt-2 space-y-2 overflow-hidden xl:bg-base-200 xl:absolute xl:w-[180px]"
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
