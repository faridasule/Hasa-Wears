import React from 'react'
import { Popover, Menu, Position, Avatar } from 'evergreen-ui'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearEmail } from '../../redux/features/authSlice'
import { auth } from '../../firebase/config'
import { toast } from 'react-toastify'
import { signOut } from 'firebase/auth'
import { CgLogOut } from 'react-icons/cg'

const AvatarPopover = ({ displayName }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //   const handleLogout = () => {
  //     // Clear the email from Redux store and navigate to home or login page
  //     dispatch(clearEmail());
  //     navigate('/');
  //   };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logout successfully.')
        navigate('/')
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const handleMyOrders = () => {
    navigate('/order-history')
  }

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item onClick={handleMyOrders}>My Orders</Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item onClick={logoutUser} icon={CgLogOut} intent="danger">
              Log Out
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Avatar
        src="/path-to-avatar-image.jpg"
        name={displayName}
        size={40}
        cursor="pointer"
        hashValue="id_124"
      />
    </Popover>
  )
}

export default AvatarPopover
