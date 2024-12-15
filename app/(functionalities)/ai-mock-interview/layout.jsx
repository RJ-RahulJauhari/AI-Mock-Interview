import React from 'react'
import Header from '../_components/Header'

const DashboardLayout = ({children}) => {
  return (
    <div>
        <div className='mx-5 sm: mx-1'>
          {children}
        </div>
    </div>
  )
}

export default DashboardLayout
