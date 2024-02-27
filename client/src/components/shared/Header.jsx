import React from "react";
import { FaFire } from "react-icons/fa";

function Header() {
  return (
    <div className="flex justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center ">
        <FaFire className="text-orange-500" />
        <p className="text-xl font-bold text-orange-500">
          Kanto<span className="text-slate-600">Grill</span>
        </p>
      </div>
    </div>
  );
}

export default Header;
