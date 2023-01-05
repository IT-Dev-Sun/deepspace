import React, { useEffect, useState } from 'react'
import ExternalLink from '../ExternalLink'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useBlockNumber } from '../../state/application/hooks'

export default function Polling() {

  const { chainId } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const [isMounted, setIsMounted] = useState(true)

  useEffect(
    () => {
      const timer1 = setTimeout(() => setIsMounted(true), 1000)
      return () => {
        setIsMounted(false)
        clearTimeout(timer1)
      }
    },
    [blockNumber] // useEffect will run only one time
  )

  return (
    <ExternalLink
      href={chainId && blockNumber ? getExplorerLink(chainId, blockNumber.toString(), 'block') : ''}
      className={`${!isMounted ? 'text-high-emphesis' : 'text-gray-500'}`}
    >
      <div className={`flex items-center space-x-2`}>
        <div>{blockNumber}</div>
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${!isMounted ? 'animate-spin' : ''}`}
          x="0px" y="0px"
          viewBox="0 0 512 512"
          width="24" height="24">
          <g>
            <path
              strokeWidth="5"
              fill="currentColor"
              stroke="currentColor"
              d="M231.3,343.7c0,0-14.5,4.2-39.4,6.3c-26.8,2.2-55.9,8.5-111.6-8.5c-55.6-17-52.9-62-31.5-93.8
              c-3.9,4.7-89.7,105,2.6,124.6c58.1,12.4,113.6-4,146.8-15.3C209.5,353.3,220.6,348.8,231.3,343.7z"/>
            <path
              strokeWidth="5"
              fill="currentColor"
              stroke="currentColor"
              d="M280.3,166.9c0,0,14.5-4.2,39.4-6.3c26.8-2.2,62.4-6.7,111.6,8.6s52.9,61.9,31.5,93.8
              c3.9-4.7,90.7-110.5-2.6-124.6c-58.8-8.9-113.6,4-146.8,15.3C302,157.3,291,161.8,280.3,166.9z"/>
            <path
              strokeWidth="5"
              fill="currentColor"
              stroke="currentColor"
              d="M445.3,215.6c-15.8-11.8-33.7-20.4-52.8-25.3c-108.5-28.7-214,37-214,37s66-103.5,209.5-112.3
              c-78-72.6-200.1-68.2-272.6,9.8c-43.2,46.5-60.9,111.4-47,173.5c10.6,8.2,26.1,16.3,49.6,22.5c108.5,28.7,214.1-37,214.1-37
              s-65.6,102.7-208.1,112.2c55.5,52.6,136.9,67.5,207.4,37.9c20.8-9.3,40-21.7,56.8-36.8C437.8,350.7,459.5,281.8,445.3,215.6
              L445.3,215.6z"/>
          </g>
        </svg>
      </div>
    </ExternalLink>
  )
}
