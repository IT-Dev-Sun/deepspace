import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { NFTItem } from '.'

export const fetchNftList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>
  fulfilled: ActionCreatorWithPayload<{
    nftList: NFTItem[]
    requestId: string
  }>
  rejected: ActionCreatorWithPayload<{
    errorMessage: string
    requestId: string
  }>
}> = {
  pending: createAction('lists/fetchNftList/pending'),
  fulfilled: createAction('lists/fetchNftList/fulfilled'),
  rejected: createAction('lists/fetchNftList/rejected'),
}