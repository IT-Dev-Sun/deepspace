import { ChainId, Currency, Percent } from '@deepspace-game/sdk'
import React, { FC, useState } from 'react'

import Gas from '../../components/Gas'
import NavLink from '../../components/NavLink'
import Settings from '../../components/Settings'
import { currencyId } from '../../functions'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { ZERO_ADDRESS } from '../../constants'
import { useUserReferringAddress, useUserReferralCode } from '../../state/user/hooks'

const getQuery = (input, output) => {
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface ExchangeHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({ input, output, allowedSlippage }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const [animateWallet, setAnimateWallet] = useState(false)
  const isRemove = router.asPath.startsWith('/remove')
  const isLimitOrder = router.asPath.startsWith('/limit-order')
  const isSwap = router.asPath.startsWith('/swap')

  const userRefCode = useUserReferralCode()
  const userReferringAddress = useUserReferringAddress()
  const isReferred = userReferringAddress == ZERO_ADDRESS ? false : true
  const referralActive = userRefCode != '0x' && userRefCode != '' ? false : isReferred

  return (
    <div>
      {/* <div className='mb-3 font-bold text-center goldman-font text-md sm:text-xl sm:mb-0' style={{ color: 'cyan' }}>Swap stuff goes here</div> */}
      <div className="flex items-center justify-end space-x-3">
        {/* <div className="grid grid-cols-2 rounded p-3px goldman-font" style={{ height: '36px' }}>
          <NavLink
            activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-lightpink to-opaque-purple "
            href={{
              pathname: '/swap',
              query: getQuery(input, output),
            }}
          >
            <a className="flex items-center justify-center px-4 font-medium text-center text-md text-secondary text-high-emphesis" style={{ backgroundColor: '#D400A9' }}>
              {i18n._(t`Swap`)}
            </a>
          </NavLink>
        </div> */}
        <div className="flex items-center">
          <div className="grid grid-flow-col gap-1">
            {isSwap && (
              <div className="relative flex items-center w-full h-full">
                <svg
                  enableBackground="new 0 0 1000 1000"
                  className={`mr-2 ${!referralActive ? 'text-low-emphesis' : 'text-green'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  aria-hidden="true"
                  width="24px"
                  height="24px"
                  x="0px"
                  y="0px"
                  viewBox="0 0 1000 1000"
                >
                  <g>
                    <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                      <path d="M2745.6,4633.8c-655.5-125.2-1175.1-594.2-1377.6-1241.7c-79.9-258.5-85.3-724.8-10.7-972.6c170.5-567.5,607.5-1025.9,1161.8-1215c183.9-61.3,634.2-98.6,807.4-66.6l90.6,16l16,207.8c58.6,754.1,559.6,1534.8,1169.8,1825.2c181.2,85.3,181.2,85.3,165.2,178.5c-8,50.6-63.9,194.5-122.6,319.8c-146.5,303.8-471.6,634.2-767.4,778.1C3513,4641.8,3105.3,4703.1,2745.6,4633.8z" />
                      <path d="M5676.6,3272.3c-850-191.9-1502.8-815.4-1721.3-1652c-79.9-301.1-79.9-794,0-1092.5c215.8-815.4,834-1430.9,1641.4-1638.7c426.3-109.2,1031.2-61.3,1430.9,114.6c612.9,271.8,1089.8,818,1276.3,1462.9c79.9,279.8,98.6,743.4,40,1036.5c-215.8,1063.2-1135.1,1814.6-2211.6,1806.6C5969.8,3309.6,5764.6,3290.9,5676.6,3272.3z" />
                      <path d="M1418.7,1249.8C1061.6,1015.4,749.9,690.3,526,317.2C384.8,82.8,230.3-295.6,161-588.7C62.4-988.4,30.4-951.1,486.1-951.1h394.4l538.2,538.3l540.9,540.9l423.7-423.7l423.7-423.7l223.8,223.8c189.2,191.8,556.9,474.3,660.8,508.9c24,8,10.7,109.2-53.3,378.4l-87.9,365.1l-175.9-21.3c-642.2-79.9-1175.1,85.3-1644,506.3l-135.9,122.6L1418.7,1249.8z" />
                      <path d="M1056.3-1358.8l-756.7-724.8l421-13.3l423.7-13.3l71.9-282.4c245.1-964.6,887.3-1614.7,1915.8-1937.1c138.6-42.6,295.8-85.3,346.4-95.9l93.3-16l-79.9,58.6c-181.2,133.2-453,421-586.2,620.8c-255.8,383.7-397,839.3-431.7,1385.6l-16,279.8l445,5.3l445,8l-759.4,727.4c-418.3,397-762.1,724.8-767.4,724.8C1815.7-631.3,1472-959.1,1056.3-1358.8z" />
                      <path d="M4024.6-1025.7c-133.2-85.3-317.1-218.5-410.3-295.8l-167.9-143.9L3902-1921c250.5-250.5,455.6-466.3,455.6-477c0-10.7-322.4-18.7-714.1-18.7h-716.8l24-165.2c29.3-239.8,143.9-591.5,253.1-794c191.8-354.4,381-546.2,897.9-916.6l210.5-149.2h2792.5H9900v221.2c-2.7,1398.9-551.6,2467.4-1630.7,3181.5l-258.5,170.5l-213.2-183.9c-341.1-295.8-692.8-479.6-1111.1-583.6c-285.1-69.3-866-61.3-1156.4,16c-415.7,111.9-852.7,357-1119.1,628.8c-63.9,66.6-125.2,119.9-133.2,119.9S4155.2-940.4,4024.6-1025.7z" />
                    </g>
                  </g>
                </svg>
              </div>
            )}
            <div className="relative flex items-center w-full h-full rounded hover:bg-dark-800">
              <Settings placeholderSlippage={allowedSlippage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExchangeHeader
