import React from 'react'
import Header from '../../components/Header'
import Main from '../../components/Main'
import StarFlow from '../../components/StarFlow'

export default function PlayLayout({ children }) {
  return (
    <>
      <div className='fixed z-10 z-50 w-full'>
        <Header />
      </div>
      <div className="z-10 pt-21">
        <Main>{children}</Main>
      </div>
      <StarFlow />
    </>
  )
}
