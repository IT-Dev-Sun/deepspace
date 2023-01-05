import React from 'react'
import Head from 'next/head'
import config from '../../../config'
import Iframe from './Iframe'

export default function Swap() {

  const configMetaData = () => {
    let val;
    if (config.ENVIRONMENT === 'DEVELOPMENT') {
      val = "Dev"
    } else if (config.ENVIRONMENT === 'PRODUCTION') {
      val = "DPS"
    } else {
      val = "Test"
    }
    return val
  }

  return (
    <div id="swap-page" style={{ width: '100%' }}>
      <Head>
        <title>DEEPSPACE - Swap | {configMetaData()}</title>
        <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="og:title" />
        <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="twitter:title" />
        <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" name="description" />
        <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="og:description" />
        <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="twitter:description" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <div className='swap-page-container'>
        <Iframe source={`https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0xf275e1AC303a4C9D987a2c48b8E555A77FeC3F1C&embed=1&theme=dark`} />
      </div>
    </div>
  )
}


