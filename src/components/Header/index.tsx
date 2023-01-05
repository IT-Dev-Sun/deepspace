import { DPS } from '@deepspace-game/sdk'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavLink from '../NavLink'
import { Popover } from '@headlessui/react'
import QuestionHelper from '../QuestionHelper'
import Web3Status from '../Web3Status'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import { assetURL } from '../../functions/deepspace'
import Particle from '../Particle'
import { useRemoveFilterData } from '../../state/others/hooks';
import config from '../../config'
import styled from 'styled-components';

const HeaderStyle = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(127, 22, 211, 0.4);
  
  .connect-wallet {
    position: absolute;
    right: 11px;
  }
  .nav-header {
    margin-left: 50px;
  }
  @media(max-width:1030px) {
    .drow-btn {
      position: absolute;
      right: 14px;
      top: 5px;
    }
    .header-wallet-btn {
      width: 250px;
    }
  }
  
`

function AppBar(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()

  const [disableWallet, setDisableWallet] = useState(false)

  const removeFilterData = useRemoveFilterData();
  const userDpsBalance = useTokenBalance(account, DPS[chainId])
  const router = useRouter();
  const handleClick = (e, pageName, path) => {
    e.preventDefault();
    if (router.pathname !== path) {
      removeFilterData();
    }
    router.push(path);

  }
  const navLinks = [
    {
      linkText: i18n._(t`Swap`),
      href: '/exchange/swap',
      navId: 'swap-nav-link',
      pageId: 'swap'
    },
    {
      linkText: i18n._(t`Outpost`),
      href: '/outpost/ships',
      navId: 'outpost-nav-link',
      pageId: 'outpost-ships'
    },
    {
      linkText: i18n._(t`Galactic Store`),
      href: '/galactic-store',
      navId: 'galactic-store-nav-link',
      pageId: 'galactic-store'
    },
    {
      linkText: i18n._(t`Inventory`),
      href: '/inventory/ships',
      navId: 'inventory-nav-link',
      pageId: 'inventory-ships'
    },
    {
      linkText: i18n._(t`Shipyard`),
      href: '/shipyard/ships',
      navId: 'shipyard-nav-link',
      pageId: 'shipyard'
    },
    {
      linkText: i18n._(t`Vault`),
      href: '/staking',
      navId: 'vault-nav-link',
      pageId: 'staking'
    },
    {
      linkText: i18n._(t`Play`),
      href: '/play',
      navId: 'play-nav-link',
      pageId: 'play'
    },
    {
      linkText: i18n._(t`Docs`),
      href: 'https://docs.deepspace.game/deepspace-dps/',
      navId: 'docs-nav-link',
      pageId: 'docs'
    },
  ]

  useEffect(() => {
    if (router.pathname === '/exchange/swap/[[...tokens]]') {
      setDisableWallet(true);
    } else {
      setDisableWallet(false);
    }
  }, [])

  return (
    <HeaderStyle>
      <header className="flex-shrink-0 w-full appbar">
        <Popover as="nav" className="z-10 w-full bg-transparent">
          {({ open }) => (
            <>
              <div className="px-6 pt-2 lg:px-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="hidden lg:block site-logo-desktop">
                      <Image unoptimized={true} src={assetURL("DPS-inline-logo-new.png")} alt="DEEPSPACE" width="280px" height="60px" />
                    </div>

                    <div className="block lg:hidden">
                      <Image
                        unoptimized={true}
                        src={assetURL("icons/icon-72x72.png")}
                        className="block md:hidden"
                        alt="DEEPSPACE"
                        width="45px"
                        height="45px"
                      />
                    </div>
                  </div>

                  <div className="hidden nav-header lg:block">
                    <div className="flex space-x-2">
                      {navLinks.filter(link => config.PAGES.includes(link.pageId)).map((link) => (
                        <NavLink href={link.href} key={link.href} activeClassName="active-link">
                          <a
                            id={link.navId}
                            className="p-2 text-lg font-bold xl:text-xl goldman-font text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis xl:px-3 md:py-1 whitespace-nowrap"
                            onClick={(e) => handleClick(e, link.linkText, link.href)}
                          >
                            {link.linkText}
                          </a>
                        </NavLink>
                      ))}
                    </div>
                  </div>


                  <div className="z-10 flex flex-row items-center justify-center p-4 bg-transparent header-wallet connect-wallet lg:w-full appbarbottom lg:block lg:w-auto bg-dark-1000 lg:relative lg:p-0">
                    {!disableWallet && (
                      <div className="flex items-center justify-between w-full px-2 py-1 bg-transparent rounded-2x bg-ds-purple-800 sm:justify-end header-wallet-btn">
                        {chainId && library && library.provider.isMetaMask && (
                          <>
                            <QuestionHelper text={i18n._(t`Add DEEPSPACE to your MetaMask wallet`)}>
                              <div
                                className="hidden rounded-md cursor-pointer sm:inline-flex p-0.5"
                                onClick={() => {
                                  const params: any = {
                                    type: 'ERC20',
                                    options: {
                                      address: DPS[chainId].address,
                                      symbol: DPS[chainId].symbol,
                                      decimals: DPS[chainId].decimals,
                                      image: 'https://raw.githubusercontent.com/deepspace-game/icons/main/token/dps.png',
                                    },
                                  }
                                  if (library && library.provider.isMetaMask && library.provider.request) {
                                    library.provider
                                      .request({
                                        method: 'wallet_watchAsset',
                                        params,
                                      })
                                      .then((success) => {
                                        if (success) {
                                          console.log('Successfully added DEEPSPACE to MetaMask')
                                        } else {
                                          throw new Error('Something went wrong.')
                                        }
                                      })
                                      .catch(console.error)
                                  }
                                }}
                              >
                                <div className="items-center hidden lg:flex">
                                  <Image
                                    unoptimized={true}
                                    src={assetURL("DPS-icon-96x96-1.png")}
                                    alt="DEEPSPACE"
                                    width="30px"
                                    height="30px"
                                    objectFit="contain"
                                    className=""
                                  />
                                </div>
                                <div className="flex items-center lg:hidden lg:mt-0">
                                  <Image
                                    unoptimized={true}
                                    src={assetURL("DPS-icon-96x96-1.png")}
                                    alt="DEEPSPACE"
                                    width="21px"
                                    height="21px"
                                    objectFit="contain"
                                    className=""
                                  />
                                </div>
                              </div>
                            </QuestionHelper>
                          </>
                        )}

                        {library && library.provider.isMetaMask && (
                          <div className="inline-block">
                            {/* <Web3Network /> */}
                          </div>
                        )}

                        <div className="flex items-center w-auto text-sm font-bold select-none whitespace-nowrap">
                          {account && chainId && userDpsBalance && (
                            <div className="px-1 py-1 text-xs font-bold text-gray-300 lg:text-base text-bold" style={{ marginTop: "2px" }}>
                              {userDpsBalance?.toSignificant(4)} {DPS[chainId].symbol}
                            </div>
                          )}
                          <div className='web3-status'>
                            <Web3Status />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex -mr-2 drow-btn lg:hidden">
                    <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                      <span className="sr-only">{i18n._(t`Open main menu`)}</span>
                      <Image unoptimized={true} src={assetURL("ci_hamburger.svg")} alt="Open main menu" width={30} height={30} />
                    </Popover.Button>
                  </div>
                </div>
              </div>

              <Popover.Panel className="lg:hidden">
                <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                  {navLinks.filter(link => config.PAGES.includes(link.pageId)).map((link) => (
                    <Link href={link.href} key={link.href}>
                      <a
                        id={link.navId}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {link.linkText}
                      </a>
                    </Link>
                  ))}
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
        <Particle />
      </header>
    </HeaderStyle>

  )
}

export default AppBar
