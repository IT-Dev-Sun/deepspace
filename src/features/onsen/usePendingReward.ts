import { useState } from 'react'
import { useComplexRewarderContract } from '../../hooks/useContract'
import { ChainId } from '@deepspace-game/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useBlockNumber } from '../../state/application/hooks'

const REWARDERS = {
  [ChainId.MAINNET]: 'some',
}

const usePending = (farm) => {
  const [balance, setBalance] = useState<string>('0')

  const { chainId, account, library } = useActiveWeb3React()
  const currentBlockNumber = useBlockNumber()

  const complexRewarder = useComplexRewarderContract(farm?.rewarder?.id)

  return balance
}

export default usePending
