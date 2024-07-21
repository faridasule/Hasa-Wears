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
import { selectOrderHistory, selectTotalOrderAmount } from "../../redux/features/orderSlice";
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
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
};

const Chart = () => {
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);

  console.log("Orders:", orders);
  console.log(totalOrderAmount, 'amount');

  // Initialize a map with all months set to 0
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const revenueMap = new Map(months.map(month => [month, { lessThan20k: 0, lessThan40k: 0, above40k: 0 }]));

  // Update the map with actual order amounts
  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    const month = orderDate.toLocaleString('default', { month: 'long' });
    const orderAmount = order.orderAmount;

    if (revenueMap.has(month)) {
      const monthData = revenueMap.get(month);
      if (orderAmount <= 20000) {
        monthData.lessThan20k += orderAmount;
      } else if (orderAmount <= 40000) {
        monthData.lessThan40k += orderAmount;
      } else {
        monthData.above40k += orderAmount;
      }
      revenueMap.set(month, monthData);
    }
  });

  // Debugging: log the revenueMap to verify data categorization
  console.log("Revenue Map:", Array.from(revenueMap.entries()));

  // Extract labels and data for the chart
  const labels = Array.from(revenueMap.keys());
  const dataLessThan20k = Array.from(revenueMap.values()).map(item => item.lessThan20k);
  const dataLessThan40k = Array.from(revenueMap.values()).map(item => item.lessThan40k);
  const dataAbove40k = Array.from(revenueMap.values()).map(item => item.above40k);

  // Debugging: log the extracted data to verify correctness
  console.log("Data < 20,000:", dataLessThan20k);
  console.log("Data 20,000 - 40,000:", dataLessThan40k);
  console.log("Data > 40,000:", dataAbove40k);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue < 20,000",
        data: dataLessThan20k,
        backgroundColor: "#064E3B",
      },
      {
        label: "20,000 > Revenue",
        data: dataLessThan40k,
        backgroundColor: "#047857",
      },
  
    ],
  };

  return (
    <div className={styles.charts}>
      <Card cardClass={styles.card}>
        <h4>Total Revenue by Month</h4>
        <Bar options={options} data={chartData} />
      </Card>
    </div>
  );
};

export default Chart;
