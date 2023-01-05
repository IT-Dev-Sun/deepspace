import React, { useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router'


function InventoryMobileFooter() {
  const router = useRouter()
  const [active, setActive] = useState(0)

  const navLinks = [
    {
      href: '/inventory/ships',
      image: require('../../asset/image/ships.svg'),
      name: "Ships",
    },
    {
      href: '/inventory/bridge',
      image: require('../../asset/image/icons/bridge.png'),
      name: "Bridge",
    },
  ]

  const onClick = (link: any, key: number) => {
    router.push(link.href)
    setActive(key)
  }

  return (
    <div className="fixed bottom-0 left-0 flex justify-around w-full pt-2 pb-2 lg:hidden" style={{ backgroundColor: "#300850" }}>
      {navLinks.map((link, key) => {
        return (
          <div className="text-center cursor-pointer" style={{ "borderBottom": `${active === key ? "2px solid #4BFFFF" : ''}`, width: '100px' }} onClick={() => onClick(link, key)} key={key}>
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

export default InventoryMobileFooter;
