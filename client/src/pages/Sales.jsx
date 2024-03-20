import React, { useEffect, useState } from "react";
import OverviewCard from "../components/sales/OverviewCard";
import {
  HiOutlineChartBar,
  HiOutlineShoppingBag,
  HiOutlineBadgeCheck,
  HiOutlineCube,
} from "react-icons/hi";
import Chart from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import useGetAllTransactions from "../hooks/transactions/useGetAllTransactions";
import useGetTransactionByMonth from "../hooks/transactions/useGetTransactionByMonth";

const data = {
  labels: ["Appetizer", "Soup", "Main Course", "Dessert", "Drinks"],
  datasets: [
    {
      label: "Sales",
      data: [300, 50, 100, 10, 130],

      hoverOffset: 4,
    },
  ],
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Sales() {
  const { getTransactionByMonthFunction, isGetTransactionByMonthLoading } =
    useGetTransactionByMonth();

  const [totalSales, setTotalSales] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  const [activeProducts, setActiveProducts] = useState("");
  const [bestProduct, setBestProduct] = useState("");
  const [top10Products, setTop10Products] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });

  const getData = async () => {
    try {
      const response = await getTransactionByMonthFunction();
      console.log(response.data);

      let newLabels = [];
      let newValue = [];

      for (let i = 0; i < response.data.transactions.length; i++) {
        newLabels.push(monthNames[response.data.transactions[i]._id - 1]);
        newValue.push(response.data.transactions[i].totalSales);
      }

      setTotalSales(response.data.totalSales.toFixed(2));
      setTotalOrders(response.data.totalOrders);
      setActiveProducts(response.data.activeProducts);
      setBestProduct(response.data.bestProduct.name);
      setTop10Products(response.data.top10Products);

      setChartData({
        ...chartData,
        labels: newLabels,
        datasets: [
          {
            label: "Sales",
            data: newValue,
            backgroundColor: "rgb(220 252 231)",
            borderColor: "rgb(34 197 94)",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      });

      const labels = Object.keys(response.data.categorySales);
      const data = Object.values(response.data.categorySales);

      setPieData({
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "rgb(254 202 202)",
              "rgb(191 219 254)",
              "rgb(254 215 170)",
              "rgb(187 247 208)",
              "rgb(233 213 255)",
            ],
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isGetTransactionByMonthLoading ? (
        <div className="flex items-center justify-center flex-1 gap-3 ">
          <span className=" loading loading-spinner"></span>
          <p className="text-lg">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-4 p-4 ">
          <div className="flex flex-1 gap-4">
            <div className="flex flex-col flex-1 gap-4 ">
              <div className="flex gap-4">
                <OverviewCard
                  icon={<HiOutlineChartBar />}
                  colorTheme={"green"}
                  label={"Total Sales"}
                  value={`₱ ${totalSales}`}
                />
                <OverviewCard
                  icon={<HiOutlineShoppingBag />}
                  colorTheme={"blue"}
                  label={"Total Orders"}
                  value={totalOrders}
                />
                <OverviewCard
                  icon={<HiOutlineCube />}
                  colorTheme={"orange"}
                  label={"Active Produdcts"}
                  value={activeProducts}
                />
                <OverviewCard
                  icon={<HiOutlineBadgeCheck />}
                  colorTheme={"purple"}
                  label={"Best Product"}
                  value={bestProduct}
                />
              </div>
              <div className="flex-1 bg-white">
                <Bar data={chartData} />
              </div>
            </div>
            <div className="w-[20rem] bg-white rounded-sm flex flex-col">
              <div className="flex flex-col p-4">
                <h1 className="font-semibold">Sales by category</h1>
                <Pie data={pieData} />
              </div>
              <div className="flex flex-col flex-1 pb-4 pl-4 ">
                <h1 className="font-semibold">Top Products</h1>
                <div className="relative flex-1 mt-1 overflow-y-auto ">
                  <div className="absolute w-full">
                    <div>
                      {top10Products.map((item, index) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 border-b cursor-pointer hover:bg-slate-100">
                          <p className="text-xs font-semibold">{index + 1}</p>
                          <p className="text-sm line-clamp-1 hover:line-clamp-none ">
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sales;
