import {
  CHAINLINK_ORACLE_ADDRESS,
  ENS_REGISTRAR_ADDRESS,
  FACTORY_ADDRESS,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MINICHEF_ADDRESS,
  MULTICALL2_ADDRESS,
  ROUTER_ADDRESS,
  STOP_LIMIT_ORDER_ADDRESS,
  SUSHI_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE_ADDRESS,
} from '@deepspace-game/sdk'

import config from '../config'

import CHAINLINK_ORACLE_ABI from '../constants/abis/chainlink-oracle.json'
import COMPLEX_REWARDER_ABI from '../constants/abis/complex-rewarder.json'
import { Contract } from '@ethersproject/contracts'
import EIP_2612_ABI from '../constants/abis/eip-2612.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import FACTORY_ABI from '../constants/abis/factory.json'
import INARI_ABI from '../constants/abis/inari.json'
import IUniswapV2PairABI from '../constants/abis/uniswap-v2-pair.json'
import LIMIT_ORDER_ABI from '../constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from '../constants/abis/limit-order-helper.json'
import MASTERCHEF_ABI from '../constants/abis/masterchef.json'
import MASTERCHEF_V2_ABI from '../constants/abis/masterchef-v2.json'
import MINICHEF_ABI from '../constants/abis/minichef-v2.json'
import MULTICALL2_ABI from '../constants/abis/multicall2.json'
import ROUTER_ABI from '../constants/abis/router.json'
import SUSHI_ABI from '../constants/abis/sushi.json'
import TIMELOCK_ABI from '../constants/abis/timelock.json'
import UNI_FACTORY_ABI from '../constants/abis/uniswap-v2-factory.json'
import WETH9_ABI from '../constants/abis/weth.json'
import ZENKO_ABI from '../constants/abis/zenko.json'
import REFERRAL_ABI from '../constants/abis/referrals.json'
import DPS_APP_ABI from '../constants/abis/DPS_App.json'
import SHIPS_ABI from '../constants/abis/DPS_Ships.json'
import BRIDGE_ABI from '../constants/abis/DPS_Bridge.json'
import SHIPYARD_ABI from '../constants/abis/DPS_Shipyard.json'
import DPS_RESOURCE_BRIDGE_ABI from '../constants/abis/DPS_Resource_Bridge.json'
import DPS_STORE_ABI from '../constants/abis/DPS_Store.json'
import DPS_SHIP_STAKING_ABI from '../constants/abis/DPS_Ship_Staking.json'
import DPS_MARKETPLACE_ABI from '../constants/abis/DPS_Marketplace.json'
import DPS_RESOURCES_SWAP_ABI from '../constants/abis/DPS_Resources_Swap.json'
import DPS_RESOURCES_ABI from '../constants/abis/DPS_Resources.json'
import DPS_CORES_ABI from '../constants/abis/DPS_Cores.json'
import TOKENPRICE_ABI from '../constants/abis/TokenPrice.json'

import { getContract } from '../functions/contract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useMemo } from 'react'

const UNI_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

// returns null on errors
export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && WNATIVE_ADDRESS[chainId], WETH9_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ENS_REGISTRAR_ADDRESS[chainId], ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticall2Contract() {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI, false)
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SUSHI_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MASTERCHEF_ADDRESS[chainId], MASTERCHEF_ABI, withSignerIfPossible)
}

export function useMasterChefV2Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MASTERCHEF_V2_ADDRESS[chainId], MASTERCHEF_V2_ABI, withSignerIfPossible)
}
export function useMiniChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MINICHEF_ADDRESS[chainId], MINICHEF_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

export function useRouterContract(useArcher = false, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  const address = ROUTER_ADDRESS[chainId]
  const abi = ROUTER_ABI

  return useContract(address, abi, withSignerIfPossible)
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
}

export function useChainlinkOracle(): Contract | null {
  return useContract(CHAINLINK_ORACLE_ADDRESS, CHAINLINK_ORACLE_ABI, false)
}

export function useReferralContract(): Contract | null {
  return useContract(config.REFERRAL_ADDRESS, REFERRAL_ABI, true)
}

export function useUniV2FactoryContract(): Contract | null {
  return useContract(UNI_FACTORY_ADDRESS, UNI_FACTORY_ABI, false)
}

export function useComplexRewarderContract(address, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}

export function useLimitOrderContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(STOP_LIMIT_ORDER_ADDRESS[chainId], LIMIT_ORDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderHelperContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12', LIMIT_ORDER_HELPER_ABI, withSignerIfPossible)
}

export function useInariContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x195E8262AA81Ba560478EC6Ca4dA73745547073f', INARI_ABI, withSignerIfPossible)
}

export function useZenkoContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xa8f676c49f91655ab3b7c3ea2b73bb3088b2bc1f', ZENKO_ABI, withSignerIfPossible)
}

export function useDeepspaceContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(config.DPS_APP_ADDRESS, DPS_APP_ABI)
}

export function useDeepspaceShipStakingContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.STAKING_ADDRESS, DPS_SHIP_STAKING_ABI)
}

export function useBridgeContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(config.BRIDGE_ADDRESS, BRIDGE_ABI)
}

export function useShipsContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(config.SHIPS_ADDRESS, SHIPS_ABI)
}

export function useMarketPlaceContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(config.MARKETPLACE_ADDRESS, DPS_MARKETPLACE_ABI)
}

export function useDpsResourcesSwapContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.DPS_RESOURCE_SWAP_ADDRESS, DPS_RESOURCES_SWAP_ABI)
}

export function useDpsResourcesContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.DPS_RESOURCE_ADDRESS, DPS_RESOURCES_ABI)
}

export function useDpsCoresContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.DPS_CORES_ADDRESS, DPS_CORES_ABI)
}

export function useDpsResourceBridgeContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.RESOURCE_BRIDGE_ADDRESS, DPS_RESOURCE_BRIDGE_ABI)
}

export function useDpsShipyardContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.DPS_SHIPYARD_ADDRESS, SHIPYARD_ABI)
}

export function useTokenPriceContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.TOKENPRICE_ADDRESS, TOKENPRICE_ABI)
}

export function useDpsStoreContract(withSignerIfPossibe?: boolean): Contract | null {
  return useContract(config.DPS_STORE_ADDRESS, DPS_STORE_ABI)
}
