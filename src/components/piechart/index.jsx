import React from 'react'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import Card from '../card/index'
import styles from './chart.module.scss'
import { selectOrderHistory } from '../../redux/features/orderSlice'
import { useSelector } from 'react-redux'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const Chart = () => {
  const orders = useSelector(selectOrderHistory)

  // Create a new array of order status
  const array = orders.map((item) => item.orderStatus)

  const getOrderCount = (arr, value) => arr.filter((n) => n === value).length

  const [q1, q2, q3, q4] = [
    'Order Placed',
    'Processing...',
    'Shipped...',
    'Delivered',
  ]

  const placed = getOrderCount(array, q1)
  const processing = getOrderCount(array, q2)
  const shipped = getOrderCount(array, q3)
  const delivered = getOrderCount(array, q4)

  const data = {
    labels: ['Placed Orders', 'Processing', 'Shipped', 'Delivered'],
    datasets: [
      {
        label: 'Order Count',
        data: [placed, processing, shipped, delivered],
        backgroundColor: [ '#003F7F','#0071c5' , '#7CB9E8', '#D6E0FF'],
        borderColor: '#fff',
            borderWidth: 2,
        
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || ''
            const value = tooltipItem.raw || 0
            return `${label}: ${value} orders`
          },
        },
      },
    },
  }

  return (
    <div className={styles.charts}>
      {/* <Card cardClass={styles.card}> */}
      <h4>Order Status Chart</h4>
      <Pie data={data} options={options} />
      {/* </Card> */}
    </div>
  )
}

export default Chart
