import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks'
import NFTState from '../index'

export const useGetNFTs = (fetchFunc) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: typeof NFTState) => state.nfts)

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchFunc(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    data: data,
  }
}
