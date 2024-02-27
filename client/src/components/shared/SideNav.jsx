import React from "react";
import { SIDENAV_LINKS } from "../../constants/sideNav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useUserContext } from "../../context/UserContextProvider";

function SideNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-between px-2 py-4 bg-white shadow-sm">
      <div className="flex flex-col gap-2">
        {SIDENAV_LINKS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={classNames(
              pathname.split("/")[1] === item.path
                ? "bg-orange-50 text-orange-500 outline outline-2 outline-orange-500  "
                : "hover:bg-slate-50",
              "flex flex-col justify-center text-xs items-center rounded aspect-square p-2  active:scale-95 transition-transform"
            )}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm flex-col justify-center">
          <div className="rounded-full bg-slate-300 w-14 aspect-square"></div>
        </div>
        <div
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-2 text-xs rounded cursor-pointer aspect-square hover:bg-slate-100">
          <RiLogoutCircleLine fontSize={28} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
