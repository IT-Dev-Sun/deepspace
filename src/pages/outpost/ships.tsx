import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Container from '../../components/Container'
import cn from 'classnames'
import Head from 'next/head'
import OutPostMobileFooter from './Footer'
import { useUpdateFilterData, useUpdateFirstID, useUpdateLastID, } from '../../state/others/hooks';
import { FILTER_DATA } from '../../constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import 'animate.css';
import config from '../../config'
import { useShipsContract } from '../../hooks'
import OutpostItem from '../../components/OutpostItems'
import OutpostActivity from '../../components/OutpostActivity'
import Default from "../../layouts/Default";
import TransparentNavbar from "../../components/TransparentNavbar";

const pageId = 'outpost-ships'

const StyledOutPostList = styled.div`
  .tab-toggle{
    color:cyan;
    width:120px;
    text-align:center;
    font-weight:bold;
    cursor:pointer;
    transition:.4s;
    border-bottom:1px solid transparent;
  }
  .tab-toggle-active{
    border-bottom:1px solid cyan;
  }
  .tab-toggle:hover{
    border-bottom:1px solid cyan;
  }

`;

export default function Ships() {
  const { account } = useActiveWeb3React();
  const [activeTab, setActiveTab] = useState('items');
  const updateFilterData = useUpdateFilterData();
  const updateFirstID = useUpdateFirstID();
  const updateLastID = useUpdateLastID();
  const [showBanner, setShowBanner] = useState(false);
  const [totalSoldShips, setTotalSoldShips] = useState('0');
  const router = useRouter();
  const routerQuery = router.query;
  const bannerAlert = config.BANNER_ALERT;
  const shipContract = useShipsContract();
  const [listedShips, setListedShips] = useState(0);
  const [userOwnedShips, setuserOwnedShips] = useState(0);
  useEffect(() => {
    (async () => {
      if (account) {
        let d = await shipContract.balanceOf(account);
        setuserOwnedShips(d.toString());
      }
      let e = await shipContract.balanceOf(config.MARKETPLACE_ADDRESS);
      setListedShips(e.toString());
    })();
  })
  useEffect(() => {
    updateFirstID(null);
    updateLastID(null);
    updateFilterData({ ...FILTER_DATA });
  }, [activeTab])
  useEffect(() => {
    let routerParams = {};
    if (Object.keys(routerQuery).length) {

      Object.keys(routerQuery).map((key, i) => {

        if (!routerQuery[key].length || key == 'sortType') routerParams[key] = routerQuery[key];
        else {
          routerParams[key] = Number(routerQuery[key]);
        }
      });
      updateFilterData(routerParams);
    }
    if (bannerAlert) {
      setShowBanner(true);
    }
  }, [])
  if (!config.PAGES.includes(pageId)) {
    return null
  }

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
    <StyledOutPostList className="w-full flex flex-col">
      <TransparentNavbar navType="outpost" />
      <Container maxWidth="full" className="flex flex-col flex-auto w-full pt-6 md:pt-5 overflow-hidden">
        <Head>
          <title>DEEPSPACE - Outpost | {configMetaData()}</title>
          <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="og:title" />
          <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="twitter:title" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" name="description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="og:description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="twitter:description" />
          <meta property="og:type" content="website" />
          <meta content="summary_large_image" name="twitter:card" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>

        {
          showBanner && (
            <div className='px-3 py-3 text-lg text-center goldman-font top-banner-alert' onClick={() => { setShowBanner(false) }}>{bannerAlert}</div>
          )
        }
        <div className='flex justify-center'>
          <div className={cn('text-md mx-4 sm:text-xl sm:mx-7 tab-toggle', {
            'tab-toggle-active': activeTab === 'items'
          })} onClick={() => { setActiveTab('items') }}>Items</div>
          <div className={cn('text-md mx-4 sm:text-xl sm:mx-7 tab-toggle', {
            'tab-toggle-active': activeTab === 'activity'
          })} onClick={() => { setActiveTab('activity') }}>Activity</div>
        </div>
        <div className='justify-center block text-sm goldman-font ship-total-status md:hidden'>
          <div className='mt-3'>

            <div>Total Ships for Sale: {listedShips}</div>
          </div>
        </div>
        <div className="flex flex-auto justify-center w-full px-0 pt-5 overflow-hidden out-post-fliter-section">
          {
            activeTab === 'items' ? (
              <OutpostItem />
            ) : (
              <OutpostActivity />
            )
          }
        </div>
        <OutPostMobileFooter />
      </Container>
    </StyledOutPostList>
  )
}


Ships.Layout = Default;

