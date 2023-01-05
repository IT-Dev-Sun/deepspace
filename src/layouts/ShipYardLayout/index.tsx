import React, { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Main from '../../components/Main'
import StarFlow from '../../components/StarFlow'
import TransparentNavbar from '../../components/TransparentNavbar'
export default function ShipYardLayout({ children }) {
  return (
    <>
      <div className='relative z-10 w-full '>
        <div className='fixed z-50 w-full'>
          <Header />
        </div>
        <div className='pt-21'>
          <div className="md:block">
            <TransparentNavbar navType="shipyard" />
          </div>
          <Main>{children}</Main>
        </div>
        <div className="z-10">
          <Footer />
        </div>
        <div id="modal-root"></div>
      </div>
      <StarFlow />
    </>
  )
}

