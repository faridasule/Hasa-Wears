import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
    Legend,
  LinearScale
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../card/index";
import styles from "./chart.module.scss";
import { selectOrderHistory } from "../../redux/features/orderSlice";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

const Chart = () => {
  const orders = useSelector(selectOrderHistory);

  // Create a new array of order status
  const array = [];
  orders.map((item) => {
    const { orderStatus } = item;
    return array.push(orderStatus);
  });

  const getOrderCount = (arr, value) => {
    return arr.filter((n) => n === value).length;
  };

  const [q1, q2, q3, q4] = [
    "Order Placed...",
    "Processing...",
    "Shipped...",
    "Delivered",
  ];

  const placed = getOrderCount(array, q1);
  const processing = getOrderCount(array, q2);
  const shipped = getOrderCount(array, q3);
  const delivered = getOrderCount(array, q4);

  const data = {
    labels: ["Placed Orders", "Processing", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Order count",
        data: [placed, processing, shipped, delivered],
        backgroundColor: "#005EB2",
      },
    ],
  };

  return (
    <div className={styles.charts}>
      <Card cardClass={styles.card}>
        <h4>Order Status Chart</h4>
        <Bar options={options} data={data} />
      </Card>
    </div>
  );
};

export default Chart;
