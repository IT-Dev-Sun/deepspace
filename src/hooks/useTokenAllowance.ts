import { CurrencyAmount, Token } from '@deepspace-game/sdk'
import { useMemo } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useTokenContract } from './useContract'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token ?.address, false)
  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result;
  return useMemo(
    () => (token && allowance ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  )
}

export function useTokenAllowanceAmount(token?: Token, owner?: string, spender?: string): string | undefined {
  const contract = useTokenContract(token ?.address, false)
  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result;
  return useMemo(
    () => (token && allowance ? allowance.toString() : undefined),
    [token, allowance]
  )
}
