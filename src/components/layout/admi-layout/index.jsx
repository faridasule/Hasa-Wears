import React, { useState } from 'react'
import { Heading, Pane } from 'evergreen-ui'
import styles from './adminlayout.module.scss'
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md'

import NavBar from '../../admin/navbar'
import AdminHeader from '../../admin/header'

const AdminLayout = ({ children }) => {
  const [mode, setMode] = useState('Full')

  return (
    <>
      <Pane
        className={`${styles.nav} ${
          mode === 'Collapsed' ? styles.collapsed : ''
        }`}
      >
        <NavBar mode={mode} />
        <Pane className={styles['nav-control']}>
          {mode === 'Collapsed' ? (
            <MdOutlineKeyboardDoubleArrowRight
              size={20}
              onClick={() => setMode('Full')}
            />
          ) : (
            <MdOutlineKeyboardDoubleArrowLeft
              size={20}
              onClick={() => setMode('Collapsed')}
            />
          )}
        </Pane>
      </Pane>
      <Pane
        className={`${styles.wrapper} ${
          mode === 'Collapsed' ? styles.collapsed : ''
        }`}
      >
        <AdminHeader mode={mode} />
        <div className={styles.body}>
          <Pane className={`${styles.content}`}>{children}</Pane>
        </div>
      </Pane>
    </>
  )
}

export default AdminLayout
