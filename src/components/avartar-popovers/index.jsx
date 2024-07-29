import React, { useState } from 'react';
import { Popover, Menu, Position, Avatar, Dialog, Heading, Paragraph, Button } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { CgLogOut } from 'react-icons/cg';
import style from './avartar.module.scss'

const AvatarPopover = ({ displayName }) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowDialog(true);
  };

  const confirmLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logout successfully.');
        navigate('/');
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setShowDialog(false);
      });
  };

  const cancelLogout = () => {
    setShowDialog(false);
  };

  const handleMyOrders = () => {
    navigate('/order-history');
  };

  return (
    <>
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item onClick={handleMyOrders}>My Orders</Menu.Item>
            </Menu.Group>
            <Menu.Divider />
            <Menu.Group>
              <Menu.Item onClick={handleLogout} icon={CgLogOut} intent="danger">
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

      {/* Confirmation Dialog */}
      <Dialog
        isShown={showDialog}
        hasFooter={false}
        hasHeader={false}
        hasClose={true}
        onCloseComplete={cancelLogout}
        onCancel={cancelLogout}
        width={400}
      >
        <Heading className={style["logout-header"]} size={600}>
          Log out of HasaWears
        </Heading>
        <Paragraph textAlign={"center"}>
          You are about to log out of HasaWears. Are you sure you want to continue?
        </Paragraph>
        <Button
          intent="danger"
          className={style["logout-button"]}
          onClick={confirmLogout}
        >
          Yes, continue
        </Button>
      </Dialog>
    </>
  );
};

export default AvatarPopover;
