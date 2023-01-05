import { ethers, BigNumber } from 'ethers'

export enum ENV_TYPES {
  DEVELOPMENT = 0,
  PRODUCTION = 1,
  TEST = 2,
}

export const PAYMENT_SYMBOL = 'DPS'
export const PAYMENT_DECIMALS = 9
export const CURRENCY_CONVERT_RATE = 0.092
export const MINT_COST = '150'
export const MINT_RAW_COST = ethers.utils.parseUnits(MINT_COST, PAYMENT_DECIMALS)

export const SHIP_TYPES = ['Fighter', 'Support', 'Tank', 'Mining']

export const SHIP_CORE_TYPES = ['Fission', 'Plasma', 'Mechanical', 'Magnetic']

export const CHART_INTERVAL = [
  {
    key: 7,
    name: 'Last 7 days',
  },
  {
    key: 14,
    name: 'Last 14 days',
  },
  {
    key: 30,
    name: 'Last 30 days',
  },
  {
    key: 60,
    name: 'Last 60 days',
  },
  {
    key: 90,
    name: 'Last 90 days',
  },
  {
    key: 0,
    name: 'Last Year',
  },
  {
    key: -1,
    name: 'All Time',
  },
]
export const STAT_NAMES = [
  'Attack',
  'Shields',
  'Speed',
  'Mining',
  'Luck',
  'Special Attack',
  'Special Defense',
  'Max Health',
]

export enum STAT_TYPES {
  ATTACK = 0,
  SHIELDS = 1,
  SPEED = 2,
  MINING = 3,
  LUCK = 4,
  SPECIAL_ATTACK = 5,
  SPECIAL_DEFENSE = 6,
  MAX_HEALTH = 7,
}

export const SHIP_TYPE_RANGE: any = [
  // Fighter
  {
    Speed: { min: 19, max: 55 },
    Attack: { min: 29, max: 100 },
    SpecialAttack: { min: 29, max: 100 },
    Mining: { min: 4, max: 30 },
    Luck: { min: 1, max: 100 },
    Shields: { min: 1, max: 50 },
    SpecialDefense: { min: 1, max: 50 },
    Health: { min: 19, max: 85 },
  },
  // Support
  {
    Speed: { min: 49, max: 100 },
    Attack: { min: 4, max: 65 },
    SpecialAttack: { min: 4, max: 65 },
    Mining: { min: 4, max: 30 },
    Luck: { min: 1, max: 100 },
    Shields: { min: 4, max: 65 },
    SpecialDefense: { min: 4, max: 65 },
    Health: { min: 19, max: 80 },
  },
  // Tank
  {
    Speed: { min: 9, max: 40 },
    Attack: { min: 4, max: 50 },
    SpecialAttack: { min: 1, max: 50 },
    Mining: { min: 4, max: 30 },
    Luck: { min: 1, max: 100 },
    Shields: { min: 39, max: 100 },
    SpecialDefense: { min: 19, max: 100 },
    Health: { min: 39, max: 100 },
  },
  // Mining
  {
    Speed: { min: 19, max: 50 },
    Attack: { min: 1, max: 55 },
    SpecialAttack: { min: 1, max: 55 },
    Mining: { min: 59, max: 100 },
    Luck: { min: 1, max: 100 },
    Shields: { min: 1, max: 60 },
    SpecialDefense: { min: 1, max: 60 },
    Health: { min: 19, max: 90 },
  },
]

export const SHIP_NUM_CORES = [
  { quantity: 0, lowest: 0, highest: 50 },
  { quantity: 1, lowest: 51, highest: 75 },
  { quantity: 2, lowest: 76, highest: 85 },
  { quantity: 3, lowest: 86, highest: 90 },
  { quantity: 4, lowest: 91, highest: 93 },
  { quantity: 5, lowest: 94, highest: 96 },
  { quantity: 6, lowest: 97, highest: 98 },
  { quantity: 7, lowest: 99, highest: 99 },
  { quantity: 8, lowest: 100, highest: 100 },
]

export const TRANSACTION_ERROR = "Can't execute transaction"

export const RESOURCE_LIST = [
  { img: '/images/resource/Iron.png', pid: 0, type: 'Iron' },
  { img: '/images/resource/Seplium.png', pid: 1, type: 'Seplium' },
  { img: '/images/resource/Hydrogen.png', pid: 2, type: 'Hydrogen' },
  { img: '/images/resource/Fenna.png', pid: 3, type: 'Fenna' },
  { img: '/images/resource/Bedasine.png', pid: 4, type: 'Bedasine' },
  { img: '/images/resource/Netherite.png', pid: 5, type: 'Netherite' },
  { img: '/images/resource/Xanifarium.png', pid: 6, type: 'Xanifarium' },
  { img: '/images/resource/Promethium.png', pid: 7, type: 'Promethium' },
]
