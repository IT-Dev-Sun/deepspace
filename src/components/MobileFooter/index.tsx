import React from 'react';
import Image from 'next/image'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

function MobileFooter(props) {
  const { i18n } = useLingui()
  const navLinks = [
    {
      href: '/exchange/swap',
      image: require('../../asset/image/ships.svg'),
      name: "Ships",
    },
    // {
    //     href: '/exchange/swap',
    //     image: require('../../asset/image/resources.svg'),
    //     name: "Resources",
    // },
    // {
    //     href: '/exchange/swap',
    //     image: require('../../asset/image/equipments.svg'),
    //     name: "Equipment",
    // },
  ]
  return (
    <div className="fixed bottom-0 left-0 flex justify-around w-full pt-2 pb-2 lg:hidden" style={{ backgroundColor: "#300850" }}>
      {navLinks.map((link, key) => {
        return (
          <div className="text-center cursor-pointer" key={key} style={{ "borderBottom": "2px solid #4BFFFF", width: '100px' }}>
            <div>
              <Image src={link.image} alt="page link" width={21} height={21} />
            </div>
            <div className="px-2 text-base text-white goldman-font sm:text-md">{link.name}</div>
          </div>
        )
      })}
    </div >
  )
}

export default MobileFooter;
