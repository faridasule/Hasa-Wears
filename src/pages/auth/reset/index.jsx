import styles from '../auth.module.scss'
import { Link } from 'react-router-dom'
import resetImg from '../../../assets/forgot.png'
import Card from '../../../components/card/index'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { auth } from '../../../firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'
import Loader from '../../../components/loader/index'
import { InlineAlert } from 'evergreen-ui'

const Reset = () => {
  const [isLoading, setIsLoading] = useState(false)

  // Formik setup with initial values, validation schema, and submit handler
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setIsLoading(true)

      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          setIsLoading(false)
          toast.success('Check your email for a reset link')
        })
        .catch((error) => {
          setIsLoading(false)
          toast.error(error.message)
        })
    },
  })

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={resetImg} alt="Reset Password" width="500" />
        </div>

        <Card cardClass={styles.card}>
          <div className={styles.form}>
            <h2>Reset Password</h2>

            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                placeholder="Email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <InlineAlert
                  intent="danger"
                  className={styles.danger}
                  marginTop={'5px'}
                >
                  {formik.errors.email}
                </InlineAlert>
              ) : null}

              <button
                type="submit"
                style={{
                  backgroundColor: '#4094F7',
                  color: '#fff',
                  marginTop: '18px',
                }}
                className="--btn --btn-block"
                disabled={formik.isSubmitting}
              >
                Reset Password
              </button>
              <div className={styles.links}>
                <p>
                  <Link to="/login">- Login</Link>
                </p>
                <p>
                  <Link to="/register">- Register</Link>
                </p>
              </div>
            </form>
          </div>
        </Card>
      </section>
    </>
  )
}

export default Reset
