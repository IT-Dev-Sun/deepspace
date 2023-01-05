import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Main from '../../components/Main'
import StarFlow from '../../components/StarFlow'
import TransparentNavbar from '../../components/TransparentNavbar'

export default function StakingLayout({ children }) {
    return (
        <>
            <div className='relative z-10 w-full'>
                <div className='fixed z-50 w-full'>
                    <Header />
                </div>
                {/* <div className="hidden md:block"> */}
                <div className='pt-21'>
                    <div className="lg:hidden">
                        <TransparentNavbar navType="staking" />
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

// inventory-nav-link
// outpost-nav-link
