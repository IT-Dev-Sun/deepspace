import { BigNumber } from '@ethersproject/bignumber'
import timezone from 'moment-timezone'
import config from '../config'
import { TextureColors } from '../constants'

export enum AssetTypes {
  Ships = 0,
}

export function getNFTImageURL(shipType: number, textureType: number, textureNum: string): string {
  return `${config.ASSETS_BASE_URI}nfts/${AssetTypes.Ships}/${shipType}/${textureType}/${textureNum}/nft.png`
}

export function getStarCount(stats: number[]): number {
  const total = stats.reduce((total, stat) => (total += stat), 0)
  if (total <= 284) return 1
  else if (total <= 352) return 2
  else if (total <= 424) return 3
  else if (total <= 465) return 4
  return 5
}
export function getTextureRarityColor(textureRarity: number): string {
  return TextureColors[textureRarity]
}
export function getStarLevel(stats: number[]): any {
  const currentLevel = Number(stats.reduce((total, stat) => (total += stat), 0))
  let maxLevel
  if (currentLevel < 284) maxLevel = 284
  else if (currentLevel < 352) maxLevel = 352
  else if (currentLevel < 424) maxLevel = 424
  else if (currentLevel < 465) maxLevel = 465
  else maxLevel = 570
  return { currentLevel, maxLevel }
}
export function assetURL(path: string): string {
  return config.ASSETS_BASE_URI + 'app/' + path
}
export function nftURL(path: string): string {
  return config.ASSETS_BASE_URI + 'nfts/' + path
}

export function detectBrowser() {
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) {
    return 'Opera'
  } else if (navigator.userAgent.indexOf('Chrome') != -1) {
    return 'Chrome'
  } else if (navigator.userAgent.indexOf('Safari') != -1) {
    return 'Safari'
  } else if (navigator.userAgent.indexOf('Firefox') != -1) {
    return 'Firefox'
  } else if (navigator.userAgent.indexOf('MSIE') != -1 || !!document.DOCUMENT_NODE == true) {
    return 'IE' //crap
  } else {
    return 'Unknown'
  }
}

export function getDateDifferent(timeStart) {
  let timeEnd = timezone.tz().utc().valueOf()
  let dif = (timeEnd - Number(timeStart) * 1000) / 1000
  let d = Number(dif.toFixed(0))
  let year = 365 * 24 * 60 * 60
  let month = 24 * 60 * 60 * 30
  let day = 24 * 60 * 60
  let hour = 60 * 60
  let minute = 60
  if (d >= year) {
    let bet = (d - (d % year)) / year
    if (bet == 1) return 'a year ago'
    return bet + ' years ago'
  } else if (d >= month) {
    let bet = (d - (d % month)) / month
    if (bet == 1) return 'a month ago'
    return bet + ' months ago'
  } else if (d >= day) {
    let bet = (d - (d % day)) / day
    if (bet == 1) return 'a day ago'
    return bet + ' days ago'
  } else if (d >= hour) {
    let bet = (d - (d % hour)) / hour
    if (bet == 1) return 'an hour ago'
    return bet + ' hours ago'
  }
  let bet = (d - (d % minute)) / minute
  if (bet <= 1) return 'a min ago'
  return bet + ' mins ago'
}

export function getAmountOut(amountIn: BigNumber, inReserve: BigNumber, outReserve: BigNumber): BigNumber {
  const FEE_MULTIPLIER = 980
  const numerator = amountIn.mul(outReserve).mul(FEE_MULTIPLIER)
  const denominator = inReserve.add(amountIn).mul(1000)
  return numerator.div(denominator)
}

export function getAmountIn(amountOut: BigNumber, inReserve: BigNumber, outReserve: BigNumber): BigNumber {
  const FEE_MULTIPLIER = 980
  const numerator = amountOut.mul(inReserve).mul(1000)
  const denominator = outReserve.mul(FEE_MULTIPLIER).sub(amountOut.mul(1000))
  return numerator.div(denominator).add(1)
}
