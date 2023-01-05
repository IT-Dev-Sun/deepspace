import { NETWORK_ICON, NETWORK_LABEL } from '../../config/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import { ChainId } from '@deepspace-game/sdk'
import Image from 'next/image'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import React from 'react'
import cookie from 'cookie-cutter'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import config from '../../config'

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  [ChainId.BSC_TESTNET]: {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'Test Binance Coin',
      symbol: 'TBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s2.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  }
}

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal} maxWidth={672}>
      <ModalHeader onClose={toggleNetworkModal} title="Select a Network" />
      <div className="mb-6 text-lg text-primary">
        You are currently browsing <span className="font-bold text-pink">DEEPSPACE</span>
        <br /> on the <span className="font-bold text-blue">{NETWORK_LABEL[chainId]}</span> network
      </div>

      <div className="grid grid-flow-row-dense grid-cols-1 gap-5 overflow-y-auto md:grid-cols-1">
        {[
          ChainId.BSC
        ].map((key: any, i: number) => {
          if (key == config.DEFAULT_CHAIN) {
            if (chainId === key) {
              return (
                <button key={i} className="w-full col-span-1 p-px rounded bg-gradient-to-r from-darkpink to-darkpurple">
                  <div className="flex items-center w-full h-full p-3 space-x-3 rounded bg-dark-1000">
                    <Image
                      src={NETWORK_ICON[key]}
                      alt={`Switch to ${NETWORK_LABEL[key]} Network`}
                      className="rounded-md"
                      width="32px"
                      height="32px"
                    />
                    <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
                  </div>
                </button>
              )
            }
            return (
              <button
                key={i}
                onClick={() => {
                  toggleNetworkModal()
                  const params = SUPPORTED_NETWORKS[key]
                  cookie.set('chainId', key)
                  if (key === ChainId.MAINNET) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account])
                  }
                }}
                className="flex items-center w-full col-span-1 p-3 space-x-3 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
              >
                <Image src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md" width="32px" height="32px" />
                <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
              </button>
            )
          }
        })}
        {[
          ChainId.BSC_TESTNET
        ].map((key: any, i: number) => {
          if (key == config.DEFAULT_CHAIN) {
            if (chainId === key) {
              return (
                <button key={i} className="w-full col-span-1 p-px rounded bg-gradient-to-r from-darkpink to-darkpurple">
                  <div className="flex items-center w-full h-full p-3 space-x-3 rounded bg-dark-1000">
                    <Image
                      src={NETWORK_ICON[key]}
                      alt={`Switch to ${NETWORK_LABEL[key]} Network`}
                      className="rounded-md"
                      width="32px"
                      height="32px"
                    />
                    <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
                  </div>
                </button>
              )
            }
            return (
              <button
                key={i}
                onClick={() => {
                  toggleNetworkModal()
                  const params = SUPPORTED_NETWORKS[key]
                  cookie.set('chainId', key)
                  if (key === ChainId.MAINNET) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account])
                  }
                }}
                className="flex items-center w-full col-span-1 p-3 space-x-3 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
              >
                <Image src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md" width="32px" height="32px" />
                <div className="font-bold text-primary">{NETWORK_LABEL[key]}</div>
              </button>
            )
          }
        })}
        {/* {['Clover', 'Telos', 'Optimism'].map((network, i) => (
          <button
            key={i}
            className="flex items-center w-full col-span-1 p-3 space-x-3 rounded cursor-pointer bg-dark-800 hover:bg-dark-700"
          >
            <Image
              src="/images/tokens/unknown.png"
              alt="Switch Network"
              className="rounded-md"
              width="32px"
              height="32px"
            />
            <div className="font-bold text-primary">{network} (Coming Soon)</div>
          </button>
        ))} */}
      </div>
    </Modal>
  )
}
