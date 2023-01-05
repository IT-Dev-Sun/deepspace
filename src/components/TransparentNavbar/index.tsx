import React, { useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import cn from 'classnames'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import NavLink from '../NavLink'
import { useAddFilterBox, useFilterBox } from '../../state/others/hooks';
import { assetURL } from '../../functions/deepspace'
import { useActiveWeb3React, useShipsContract } from '../../hooks'
import config from '../../config';
import { useUserBurnedShips } from '../../services/graph/hooks/deepspace'

const StyledCard = styled.div`
  .circle {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: rgba(212, 0, 166, 0.7);
  }

  .second-nav {
    background: rgba(0, 0, 0, 0.25);
    background-blend-mode: multiply;
  }

  .active-link {
    color: #00ffff;
    border-bottom: 1px solid #00ffff;
  }

  @media(max-width:1030px) {
    #resource-swap-nav-link {
      display: none;
    }
    #inventory-bridge-nav-link {
      display: none;
    }
  }

`

interface NavbarProps {
  navType: 'inventory' | 'outpost' | 'staking' | 'play' | 'shipyard'
}

export default function TransparentNavbar({ navType }: NavbarProps) {
  const addFilterBox = useAddFilterBox();
  const { account } = useActiveWeb3React();
  const shipContract = useShipsContract();
  const filterBox = useFilterBox();
  const [f, setF] = React.useState(true)
  const [listedShips, setListedShips] = useState(0);
  const [userOwnedShips, setuserOwnedShips] = useState(0);
  const [userBurnedShips, setUserBurnedShps] = useState(0);
  const { data: burnedShipData, mutate: userBurnedShipListing, error: burnedShipError } = useUserBurnedShips();
  React.useEffect(() => {
    (async () => {
      if (account) {
        let d = await shipContract.balanceOf(account);
        setuserOwnedShips(d.toString());
      }
      let e = await shipContract.balanceOf(config.MARKETPLACE_ADDRESS);
      setListedShips(e.toString());
    })();
  })
  React.useEffect(() => {
    if (burnedShipData && burnedShipData.length) {
      setUserBurnedShps(burnedShipData[0].numShips);
    }
  }, [burnedShipData])
  React.useEffect(() => {
    setF(filterBox)
  }, [filterBox])
  const lastPart = window.location.href.split('/').pop()

  let navLinks;
  if (navType === 'outpost') {
    navLinks = [
      {
        linkText: i18n._(t`Ships`),
        MobilelinkText: i18n._(t`Outpost`),
        href: '/outpost/ships',
        id: 'ships-nav-link',
      },
      {
        linkText: i18n._(t`Resource Swap`),
        MobilelinkText: '',
        href: '/outpost/resource-swap',
        id: 'resource-swap-nav-link',
      },
    ]
  } else if (navType === 'inventory') {
    navLinks = [
      {
        linkText: i18n._(t`Ships`),
        MobilelinkText: i18n._(t`Inventory`),
        href: '/inventory/ships',
        id: 'inventory-ships-nav-link',
      },
      {
        linkText: i18n._(t`Bridge`),
        href: '/inventory/bridge',
        id: 'inventory-bridge-nav-link',
      },

    ]
  } else if (navType === 'play') {
    navLinks = [
      {
        linkText: i18n._(t`Play`),
        MobilelinkText: i18n._(t`Play`),
        href: '/inventory/Play_',
        id: 'ships-nav-link',
      }]
  } else if (navType === 'staking') {
    navLinks = [
      {
        linkText: i18n._(t`Vault`),
        MobilelinkText: i18n._(t`Vault`),
        href: '/staking',
        id: 'ships-nav-link',
      }]
  } else if (navType === 'shipyard') {
    navLinks = [
      {
        linkText: i18n._(t`Ships`),
        MobilelinkText: i18n._(t`Shipyard`),
        href: '/shipyard',
        id: 'shipyard-nav-link',
      }]
  }

  return (
    <StyledCard className="goldman-font">
      <div className="relative flex flex-row justify-center w-full px-6 second-nav md:pb-3 xl:pb-2 lg:px-4">
        <div className="absolute self-center ml-4 top-3" style={{ "left": "18px" }}>
          {lastPart !== 'calender' && (
            <span className="mr-2">
              {' '}
              <Image unoptimized={true} className="cursor-pointer" src={assetURL("updownarrow.png")} alt="upanddownlogo" width={18} height={21} onClick={() => {
                addFilterBox()
              }} />
            </span>
          )}
        </div>

        {navLinks.map((link) => (
          <NavLink href={link.href} key={link.href} activeClassName="active-link">
            <a
              id={link.id}
              className="p-2 text-2xl font-bold text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:px-3 md:py-1 whitespace-nowrap"
            >
              <span className="hidden lg:block">{link.linkText}</span>
              <span className="block lg:hidden">{link.MobilelinkText}</span>
            </a>

          </NavLink>
        ))}
        <div className={cn('hidden absolute top-2 right-1 mt-1 mr-2 text-sm md:block ship-total-status', {

        })} style={{ fontSize: '13px', lineHeight: '1.2' }}>
          {
            navType === 'inventory' && account && (
              <div>
                <div>Your Ships In Inventory: {userOwnedShips}</div>
                <div>Your Total Ships Burned: {userBurnedShips}</div>
              </div>
            )
          }
          {
            navType === 'outpost' && (
              <>
                <div className='mt-1'>Total Ships for Sale: {listedShips}</div>
              </>
            )
          }
        </div>
      </div>
    </StyledCard>
  )
}
