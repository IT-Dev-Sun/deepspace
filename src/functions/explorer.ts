import { ChainId } from '@deepspace-game/sdk'

// Multichain Explorer
const builders = {
  etherscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://${chainName ? `${chainName}.` : ''}etherscan.io`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  fantom: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://ftmscan.com'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  xdai: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://blockscout.com/poa/xdai`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  bscscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://${chainName ? `${chainName}.` : ''}bscscan.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  matic: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://polygonscan.com'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  // token is not yet supported for arbitrum
  arbitrum: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://mainnet-arb-explorer.netlify.app`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  // token is not yet supported for arbitrum
  arbitrumTestnet: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://explorer.offchainlabs.com/#`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return prefix
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  moonbase: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://moonbeam-explorer.netlify.app'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'address':
        return `${prefix}/address/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  avalanche: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://cchain.explorer.avax${chainName ? `-${chainName}` : ''}.network`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  heco: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://${chainName ? `${chainName}.` : ''}hecoinfo.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  harmony: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://beta.explorer.harmony.one/#'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  harmonyTestnet: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://explorer.pops.one/#'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  okex: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://www.oklink.com/okexchain'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokenAddr/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  okexTestnet: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://www.oklink.com/okexchain-test'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokenAddr/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  celo: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://explorer.celo.org'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  palm: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://explorer.palm.io'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
}

interface ChainObject {
  [chainId: number]: {
    chainName: string
    builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

const chains: ChainObject = {
  [ChainId.MAINNET]: {
    chainName: '',
    builder: builders.etherscan,
  },
  [ChainId.ROPSTEN]: {
    chainName: 'ropsten',
    builder: builders.etherscan,
  },
  [ChainId.RINKEBY]: {
    chainName: 'rinkeby',
    builder: builders.etherscan,
  },
  [ChainId.BSC]: {
    chainName: '',
    builder: builders.bscscan,
  },
  [ChainId.BSC_TESTNET]: {
    chainName: 'testnet',
    builder: builders.bscscan,
  }
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const chain = chains[chainId]
  return chain.builder(chain.chainName, data, type)
}
