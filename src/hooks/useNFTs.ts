import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'
import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '../functions'
import { useContract } from './useContract'

const useFarms = () => {
    const [farms, setFarms] = useState<any | undefined>()
    const { account } = useActiveWeb3React()

    

}