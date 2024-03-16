import classNames from "classnames";
import React, { useState } from "react";

const colorThemes = {
  green: {
    bg: "bg-green-100",
    text: "text-green-500",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-500",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-500",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-500",
  },
};

function OverviewCard({ icon, label, value, colorTheme }) {
  const theme = colorThemes[colorTheme];

  return (
    <div className="flex items-center flex-1 gap-3 px-4 py-2 bg-white rounded ">
      <div
        className={classNames(
          theme.bg,
          theme.text,
          "flex items-center justify-center w-10 text-2xl rounded-full aspect-square"
        )}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-light">{label}</p>
        <p className="text-lg font-semibold line-clamp-1">{value}</p>
      </div>
    </div>
  );
}

export default OverviewCard;
