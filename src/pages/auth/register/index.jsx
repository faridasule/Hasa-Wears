import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import styles from '../auth.module.scss'
import registerImg from '../../../assets/register.jpg'
import Card from '../../../components/card'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/config'
import Loader from '../../../components/loader'
import { toast } from 'react-toastify'
import { InlineAlert, EyeOffIcon, EyeOpenIcon } from 'evergreen-ui'

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State for password visibility
  const navigate = useNavigate()

  // Formik setup with initial values, validation schema, and submit handler
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      cPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      cPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setIsLoading(true)

      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          const user = userCredential.user
          signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
              setIsLoading(false)
              toast.success('Registration and Login Successful...')
              navigate('/')
            })
            .catch((error) => {
              setIsLoading(false)
              toast.error(error.message)
            })
        })
        .catch((error) => {
          setIsLoading(false)
          toast.error(error.message)
        })
    },
  })

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <Card cardClass={styles.card}>
          <div className={styles.form}>
            <h2>Sign Up</h2>
            <p>We’ll get you up to speed to verify your details after submitting your details.</p>
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

              <div className={styles.passwordField}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <EyeOpenIcon color="#999999" /> : <EyeOffIcon color="#999999" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <InlineAlert
                  intent="danger"
                  className={styles.danger}
                  marginBottom={'1rem'}
                >
                  {formik.errors.password}
                </InlineAlert>
              ) : null}

              <input
                type="password"
                placeholder="Confirm Password"
                {...formik.getFieldProps('cPassword')}
              />
              {formik.touched.cPassword && formik.errors.cPassword ? (
                <InlineAlert
                  intent="danger"
                  className={styles.danger}
                  marginBottom={'1rem'}
                >
                  {formik.errors.cPassword}
                </InlineAlert>
              ) : null}

              <button
                type="submit"
                className="--btn --btn-block"
                disabled={formik.isSubmitting}
                style={{ backgroundColor: '#4094F7', color: '#fff', marginTop: '18px' }}
              >
                Sign Up
              </button>
            </form>

            <span className={styles.register}>
              <p>Already have an account?</p>
              <div>
                <Link style={{ color: '#1f93ff' }} to="/login">
                  Sign In
                </Link>
              </div>
            </span>
          </div>
        </Card>
      </section>
    </>
  )
}

export default Register
