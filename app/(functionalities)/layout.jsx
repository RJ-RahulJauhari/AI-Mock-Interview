import Header from './_components/Header'
import React from 'react'

const FunctionalitiesLayout = ({children}) => {
  return (
    <div>
        <Header></Header>
        {children}
    </div>
  )
}

export default FunctionalitiesLayout