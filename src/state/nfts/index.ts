import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BigNumber } from '@ethersproject/bignumber'
import { useAppDispatch } from '../hooks'
import { useEffect } from 'react'
import config from '../../config'
import SHIPS_ABI from '../../constants/abis/DPS_Ships.json'
import { getContract } from '../../functions'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@deepspace-game/sdk'

export type ShipProperties = [string, string, number[], number[]]

export type NFTItem = [number, ShipProperties]

export interface NFTState {
  isInitialized: boolean
  isLoading: boolean
  data: NFTItem[]
}

export const initialState: NFTState = {
  isInitialized: false,
  isLoading: false,
  data: null,
}

/*
struct Ship {
    string name;
    string tokenURI;
    uint8[] stats;
    uint8[] cosmetics;
}
*/

export const getUserNfts = (account) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchUserNfts(account))
  }, [account])
}

// Thunks
export const fetchUserNfts = createAsyncThunk<NFTItem[], { account: string; library: Web3Provider; chainId: ChainId }>(
  'nfts/fetchUserNfts',
  async ({ account, library, chainId }) => {
    //const { library, account, chainId } = useActiveWeb3React()
    const shipsContract = getContract(config.SHIPS_ADDRESS, SHIPS_ABI, library, account)
    //const shipsContract = useShipsContract()
    const getTokenIdAndData = async (index: number) => {
      try {
        const tokenIdBn: BigNumber = await shipsContract.tokenOfOwnerByIndex(account, index)
        const tokenId = tokenIdBn.toNumber()

        //const tokenUri = await shipsContract.tokenURI(tokenId)
        //const uriDataResponse = await fetch(tokenUri)
        //const uriData = uriDataResponse.ok ? await uriDataResponse.json() : null

        const shipProperties = await shipsContract.getShipProperties(tokenId)

        return [Number(tokenId), shipProperties]
      } catch (error) {
        console.error('getTokenIdAndData', error)
        return null
      }
    }

    const balanceOfResponse = await shipsContract.balanceOf(account)
    const balanceOf = balanceOfResponse.toNumber()

    if (balanceOf === 0) {
      return []
    }

    const nftDataFetchPromises = []

    // For each index get the tokenId and data associated with it
    for (let i = 0; i < balanceOf; i++) {
      nftDataFetchPromises.push(getTokenIdAndData(i))
    }

    const nftData = await Promise.all(nftDataFetchPromises)

    return nftData
  }
)

export const nftSlice = createSlice({
  name: 'nfts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserNfts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchUserNfts.fulfilled, (state, action) => {
      state.isLoading = false
      state.isInitialized = true
      state.data = action.payload
    })
  },
})

export default nftSlice.reducer
