import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CATEGORY_ITEMS } from "../constants/homeNav";
import classNames from "classnames";

function Home() {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-1 gap-4 p-4">
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex gap-2 p-3 bg-white rounded shadow-sm">
          {CATEGORY_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={classNames(
                pathname.split("/")[2] === item.path
                  ? "bg-orange-50 text-orange-500 outline outline-2 outline-orange-500"
                  : "hover:bg-slate-50",
                "text-sm   px-2 py-1 rounded"
              )}>
              <p className="text-nowrap">{item.label}</p>
            </Link>
          ))}
        </div>
        <Outlet />
      </div>
      <div className="w-[30rem] bg-white rounded p-4 shadow-sm">On Cart</div>
    </div>
  );
}

export default Home;
