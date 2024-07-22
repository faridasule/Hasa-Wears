import { useState, useEffect} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import styles from '../auth.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/card/index'
import { auth } from '../../../firebase/config'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { toast } from 'react-toastify'
import Loader from '../../../components/loader/index'
import { useSelector } from 'react-redux'
import { selectPreviousURL } from '../../../redux/features/cartSlice'
import { selectEmail, SET_ACTIVE_USER} from '../../../redux/features/authSlice'
import { InlineAlert, EyeOffIcon, EyeOpenIcon } from 'evergreen-ui'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) 
  const previousURL = useSelector(selectPreviousURL)
  const userEmail = useSelector(selectEmail)
  const navigate = useNavigate()


  useEffect(() => {
    if (userEmail === 'admin@gmail.com') {
      navigate('/admin/dashboard')
    }
  }, [userEmail, navigate])

  // Function to redirect the user based on the previous URL
  const redirectUser = (email) => {
    if (email === 'admin@gmail.com') {
      return navigate('/admin/dashboard')
    }
    if (previousURL.includes('cart')) {
      return navigate('/cart')
    }
    navigate('/')
  }
  
  // Formik setup with initial values, validation schema, and submit handler
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setIsLoading(true)
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          const user = userCredential.user
          setIsLoading(false)
          toast.success('Login Successful...')
          redirectUser(values.email)
        })
        .catch((error) => {
          setIsLoading(false)
          toast.error(error.message)
        })
    },
  })

  // Function to handle Google Sign-In
  const provider = new GoogleAuthProvider()
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        toast.success('Login Successful...')
        redirectUser()
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

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
            <h2>Sign In</h2>
            <p>
              Please input your email and password details to get logged in.
            </p>
            <button
              className="--btn --btn-block"
              onClick={signInWithGoogle}
              style={{
                textAlign: 'cener',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#E5E9EB',
                width: '100%',
                borderRadius: '6px',
                marginTop: '24px',
              }}
            >
              <FcGoogle size={24} />
              <span syle={{ color: '#252C32', fontSize: '10px' }}>
                {' '}
                Sign in With Google
              </span>
            </button>

            <h5>-- Or continue with --</h5>

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
                  {showPassword ? (
                    <EyeOpenIcon color="#999999" />
                  ) : (
                    <EyeOffIcon color="#999999" />
                  )}
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
                Sign In
              </button>
              <div className={styles.links}>
                <Link
                  style={{ color: '#1f93ff', fontSize: '14px' }}
                  to="/reset"
                >
                  Reset Password
                </Link>
              </div>
            </form>

            <span className={styles.register}>
              <p>Don't have an account?</p>
              <div>
                <Link style={{ color: '#1f93ff'}} to="/register">
                  Sign Up
                </Link>
              </div>
            </span>
          </div>
        </Card>
      </section>
    </>
  )
}

export default Login
