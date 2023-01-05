import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Banner from '../../components/Banner'
import React, { RefObject, useEffect } from "react";
import Scrollbar from "smooth-scrollbar";
import StarFlow from "../../components/StarFlow";

const Layout = ({ children, banner = undefined }) => {
  const root: RefObject<HTMLDivElement> = React.createRef()

  useEffect(() => {
    Scrollbar.init(root.current)
  }, [root])

  return (
    <>
      <div ref={root} className="h-screen flex flex-col relative z-10">
        <div className='flex flex-auto flex-col h-screen pb-4'>
          <Header />
          {banner && <Banner />}
          <main className="flex flex-auto overflow-hidden relative">{children}</main>
          <div id="modal-root"></div>
        </div>

        <div className='footer-wrapper'>
          <Footer />
        </div>
      </div>
      <StarFlow />
    </>
  )
}

export default Layout
