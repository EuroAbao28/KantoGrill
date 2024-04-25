import React from "react";
import { SIDENAV_LINKS } from "../../constants/sideNav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

function SideNav() {
  const { pathname } = useLocation();

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
    </div>
  );
}

export default SideNav;
