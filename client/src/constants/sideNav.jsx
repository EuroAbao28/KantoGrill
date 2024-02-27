import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineChartPie,
  HiOutlineArchive,
  HiOutlineClipboardList,
} from "react-icons/hi";

export const SIDENAV_LINKS = [
  {
    label: "Home",
    path: "home",
    icon: <HiOutlineHome fontSize={28} />,
  },
  {
    label: "Sales",
    path: "sales",
    icon: <HiOutlineChartPie fontSize={28} />,
  },
  {
    label: "Inventory",
    path: "inventory",
    icon: <HiOutlineArchive fontSize={28} />,
  },
  {
    label: "Users",
    path: "users",
    icon: <HiOutlineUserGroup fontSize={28} />,
  },
  {
    label: "Logs",
    path: "logs",
    icon: <HiOutlineClipboardList fontSize={28} />,
  },
];
