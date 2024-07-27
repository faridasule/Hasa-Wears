import React, { useEffect, useRef } from "react";
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

const getGradient = (ctx, chartArea) => {
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, '#4D79FF');
  gradient.addColorStop(1, '#D6E0FF');
  return gradient;
};

const Chart = () => {
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);
  const chartRef = useRef(null);

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

  // Extract labels and data for the chart
  const labels = Array.from(revenueMap.keys());
  const dataLessThan20k = Array.from(revenueMap.values()).map(item => item.lessThan20k);
  const dataLessThan40k = Array.from(revenueMap.values()).map(item => item.lessThan40k);
  const dataAbove40k = Array.from(revenueMap.values()).map(item => item.above40k);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue < 20,000",
        data: dataLessThan20k,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return getGradient(ctx, chartArea);
        },
      },
      {
        label: "20,000 <= Revenue <= 40,000",
        data: dataLessThan40k,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return getGradient(ctx, chartArea);
        },
      },
      {
        label: "Revenue > 40,000",
        data: dataAbove40k,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return getGradient(ctx, chartArea);
        },
      },
    ],
  };

  return (
    <div className={styles.charts}>
      <Card cardClass={styles.card}>
        <h4>Total Revenue by Month</h4>
        <Bar ref={chartRef} options={options} data={chartData} />
      </Card>
    </div>
  );
};

export default Chart;
