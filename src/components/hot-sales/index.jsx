import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useFetchCollection from '../../custopm-hook/useFetchCollection'
import {
  selectProducts,
  STORE_PRODUCTS,
} from '../../redux/features/productSlice'
import styles from './hotsales.module.scss'
import Card from '../../components/card/index'

const HotSales = () => {
  const { data: productsData, isLoading } = useFetchCollection('products')
  const products = useSelector(selectProducts)
  const dispatch = useDispatch()

  useEffect(() => {
    if (productsData) {
      dispatch(
        STORE_PRODUCTS({
          products: productsData,
        }),
      )
    }
  }, [dispatch, productsData])

  // Function to sort products based on createdAt or addedDate
  const sortByDate = (a, b) => {
    return (
      new Date(b.createdAt || b.addedDate) -
      new Date(a.createdAt || a.addedDate)
    )
  }

  // Sorting products and getting top 6
  const sortedProducts = products.slice().sort(sortByDate)
  const top6Products = sortedProducts.slice(0, 6)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p>Hot Sales</p>
        <h2>Unlimited options give you the ultimate flexibility</h2>
        <div className={styles.wrapper}>
          {isLoading ? (
            <p style={{textAlign: 'center'}}>Loading...</p>
          ) : (
            top6Products.map((product) => (
              <Card key={product.id} cardClass={styles.card}>
                <div className={styles.products}>
                  <div className={styles.imageContainer}>
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.info}>
                    <div>
                      <p>New</p>
                      <h3>{product.name}</h3>
                      <h3>Sizes: M, L, S</h3>
                    </div>
                  </div>
                </div>
                <div>
                  <h3>{`N${product.price}`}</h3>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default HotSales
