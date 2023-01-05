import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import Container from '../../components/Container'
import ResourcesCard from '../../components/ResourcesCard'
import InventoryLayout from '../../layouts/InventoryLayout'

const StyledCard = styled.div`
  margin: auto;
  max-width: 1590px;
`
export default function resources() {
  return (
    <StyledCard>
      <Container maxWidth="full" className="w-full py-5 md:px-0 lg:px-0">
        <Head>
          <title>{process.env.NEXT_PUBLIC_PAGE_TITLE}</title>
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" name="description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="og:description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="twitter:description" />
          <meta property="og:type" content="website" />
          <meta content="summary_large_image" name="twitter:card" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>

        <div className="relative flex flex-col justify-center w-full ">
          <div className="flex flex-wrap justify-center w-full mx-auto md:px-4 lg:px-1 xl:px-6 2xl:px-16">
            <ResourcesCard id={1122} type="fenna" unit="70 units" />
            <ResourcesCard id={1122} type="xanifarium" unit="70 units" />
            <ResourcesCard id={1122} type="netherite" unit="70 units" />
            <ResourcesCard id={1122} type="bedasine" unit="70 units" />
            <ResourcesCard id={1122} type="hydrogen" unit="70 units" />
            <ResourcesCard id={1122} type="bedasine" unit="70 units" />
            <ResourcesCard id={1122} type="seplium" unit="70 units" />
            <ResourcesCard id={1122} type="xanifarium" unit="70 units" />
            <ResourcesCard id={1122} type="fenna" unit="70 units" />
            <ResourcesCard id={1122} type="xanifarium" unit="70 units" />
            <ResourcesCard id={1122} type="seplium" unit="70 units" />
            <ResourcesCard id={1122} type="xanifarium" unit="70 units" />
            <ResourcesCard id={1122} type="hydrogen" unit="70 units" />
            <ResourcesCard id={1122} type="xanifarium" unit="70 units" />
            <ResourcesCard id={1122} type="hydrogen" unit="70 units" />
            <ResourcesCard id={1122} type="promethium" unit="70 units" />
            <ResourcesCard id={1122} type="iron" unit="70 units" />
            <ResourcesCard id={1122} type="promethium" unit="70 units" />
          </div>
        </div>
      </Container>
    </StyledCard>
  )
}

resources.Layout = InventoryLayout
