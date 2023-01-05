import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import cn from 'classnames'
import Head from 'next/head'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useDeepspaceContract, useShipsContract } from '../../hooks'
import styled from 'styled-components'
import ShipCard from '../../components/ShipCard'
import FilterShips from '../../components/FilterShips'
import Pagination from '../../components/Pagination'
import InventoryMobileFooter from './Footer'
import { useShipListings, useUserBurnedShips } from '../../services/graph/hooks/deepspace'
import {
  useFilterBox,
  useFilterData,
  useFirstID,
  useLastID,
  useShipSelects,
  useUpdateFilterData,
  useUpdateFirstID,
  useUpdateLastID
} from '../../state/others/hooks';
import { useCardCount } from '../../functions'
import config from '../../config';
import 'react-loading-skeleton/dist/skeleton.css'
import 'animate.css';
import SkeletonLoading from '../../components/SkeletonLoading';
import Default from "../../layouts/Default";
import Scrollbar from "smooth-scrollbar";
import TransparentNavbar from "../../components/TransparentNavbar";

const pageId = "inventory-ships"

const StyleNftList = styled.div`
`

export default function Ships() {
  const filterData = useFilterData();
  const updateFilterData = useUpdateFilterData();
  const shipSelects = useShipSelects();
  const [pagination, setPagination] = useState(0);
  const [paginationPrevDirection, setPaginationPrevDirection] = useState(1);
  const { account } = useActiveWeb3React()
  const fBox = useFilterBox();
  const [width, setWidth] = useState(0);
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState(true); // change =>true, dischange =>false
  const updateLastID = useUpdateLastID();
  const updateFirstID = useUpdateFirstID();
  const deepspaceContract = useDeepspaceContract();
  const shipContract = useShipsContract();
  const cardCount = useCardCount(width);
  const [nextID, setNextID] = useState(null);
  const [mintEndTime, setMintEndTime] = useState(null);
  const [mintStartTime, setMintStartTime] = useState(null);
  const [displayTimer, setDisplayTimer] = useState(null);
  const [content, setContent] = useState('');
  const [userOwnedShips, setuserOwnedShips] = useState(0);
  const [userBurnedShips, setUserBurnedShps] = useState(0);

  const firstID = useFirstID();
  const lastID = useLastID();
  const { data: listingData, mutate: userShipsMutate, error: userShipError } = useShipListings(filterStatus, cardCount, paginationPrevDirection, nextID, 'inventory');
  const { data: burnedShipData, mutate: userBurnedShipListing, error: burnedShipError } = useUserBurnedShips();
  const routerQuery = router.query;

  const scrollable: RefObject<HTMLDivElement> = React.createRef()

  useEffect(() => {
    if (!!listingData && !!scrollable.current) {
      Scrollbar.init(scrollable.current, {continuousScrolling: false, alwaysShowTracks: true})
    }
  }, [listingData, scrollable])

  useEffect(() => {
    (async () => {
      if (account) {
        let d = await shipContract.balanceOf(account);
        setuserOwnedShips(d.toString());
      }
    })();
  })
  useEffect(() => {
    if (burnedShipData && burnedShipData.length) {
      setUserBurnedShps(burnedShipData[0].numShips);
    }
  }, [burnedShipData])
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
    handleCanMint();
  }, [])

  useEffect(() => {
    setPagination(0);
    setFilterStatus(true);
  }, [shipSelects])

  useEffect(() => {
    updateFirstID(null);
    updateLastID(null);
    setNextID(null);
    setFilterStatus(true);
    setPaginationPrevDirection(1);
    setPagination(0);
  }, [userShipsMutate])

  useEffect(() => {
    updateFirstID(null);
    updateLastID(null);
    setNextID(null);
    setPagination(0);
    setFilterStatus(true);
    setPaginationPrevDirection(1);
  }, [fBox, filterData])

  useEffect(() => {
    if (pagination != 0) setFilterStatus(false);
  }, [pagination]);

  useEffect(() => {
    if (mintEndTime && mintStartTime) {
      let d = new Date();
      const currentTime = d.getTime();
      if (currentTime < mintStartTime) {
        setDisplayTimer(mintStartTime);
        setContent("Genesis Collection Mint Starts In:");
      } else if (mintStartTime <= currentTime && currentTime <= mintEndTime) {
        setDisplayTimer(mintEndTime);

        setContent("Genesis Collection Mint Ends In:");
      } else {
        setDisplayTimer(currentTime);
        setContent("");
      }
    }
  }, [mintStartTime, mintEndTime]);


  const handleCanMint = async () => {
    const mintStart = await deepspaceContract.mintStart();
    const mintEnd = await deepspaceContract.mintEnd();

    let d = new Date();
    setMintStartTime(d.setTime(Number(mintStart.toString()) * 1000))
    d = new Date();
    setMintEndTime(d.setTime(Number(mintEnd.toString()) * 1000));
  }

  const handlePagination = (dir) => {
    if (!listingData || (listingData.length != shipSelects + 1 && dir > 0)) {
      if (paginationPrevDirection != -1) dir = 0;
    }
    let d = pagination + dir;
    d = Math.max(0, d);
    if (pagination != d && dir != 0) {
      if (dir != paginationPrevDirection) {
        setPaginationPrevDirection(dir);
        setNextID(firstID);
      } else {
        setNextID(lastID);
      }
    }
    setPagination(d);
  }

  const handleTimer = () => {
    let d = new Date();
    const currentTime = d.getTime();

    if (currentTime < mintStartTime) {
      setDisplayTimer(mintStartTime);
      setContent("Genesis Collection Mint Starts In:");
    } else if (mintStartTime <= currentTime && currentTime <= mintEndTime) {
      setDisplayTimer(mintEndTime)
      setContent("Genesis Collection Mint Ends In:");
    } else {
      setDisplayTimer(currentTime);
      setContent("");
    }
  }

  const NFTList = useCallback(() => {
    let shipData = [];
    if (listingData) shipData = [...listingData];

    if (paginationPrevDirection != 1 && listingData) {
      shipData = [...listingData].reverse()
      if (shipData && shipData.length == shipSelects + 1) {
        shipData.shift();
      }
    } else {
      if (shipData && shipData.length == shipSelects + 1) {
        shipData.splice(-1, 1);
      }
    }
    return (
      <>
        <StyleNftList className={cn("inline-flex flex-wrap justify-center px-6 pt-5 w-full", {})}>
          {shipData && filterData && shipData.map((ship, key) => {
            let nft;
            if (filterData.listed == 1) {
              nft = ship['listing'];
            } else {
              nft = ship['ship'];
            }
            return (
              <div className="px-3" key={key}>
                <ShipCard
                  cardType={filterData.listed === 1 ? "my-listing" : "inventory"}
                  key={key}
                  nftData={filterData.listed === 1 ? nft['token'] : nft}
                  price={filterData.listed === 1 ? nft['price'] : '0'}
                  nftFullData={nft}
                />
              </div>
            )
          })}
        </StyleNftList>
        {
          account && !userShipError && listingData == null && (
            <div className='flex flex-wrap justify-center'>
              {

                [...Array(5)].map((item, key) => {
                  return (
                    <div className='px-3' key={key}>
                      <SkeletonLoading />
                    </div>
                  )
                })
              }
            </div>
          )
        }
        {
          (account && listingData?.length == 0) && (
            <div className="flex items-center justify-center w-full">No Matching NFTs</div>
          )
        }
        {
          !account && (
            <div className="flex items-center justify-center w-full">You must connect to view inventory</div>
          )
        }

        {(account && userShipError) && (
          <div className="flex items-center justify-center w-full">NFT searching temporarily unavailable. Please try again later.</div>
        )}
      </>
    )
  }, [listingData, pagination, fBox, cardCount, userShipsMutate])

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
    <>
      <div className='w-full flex flex-col'>
        <Head>
          <title>DEEPSPACE - Inventory | {configMetaData()}</title>
          <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="og:title" />
          <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="twitter:title" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" name="description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="og:description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="twitter:description" />
          <meta property="og:type" content="website" />
          <meta content="summary_large_image" name="twitter:card" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <TransparentNavbar navType="inventory" />
        <div className="justify-center block mt-2 mb-2 text-sm goldman-font ship-total-status md:hidden">
          {
            account && (
              <div>
                <div>Your Total Ships In Inventory: {userOwnedShips}</div>
                <div>Your Total Ships Burned: {userBurnedShips}</div>
              </div>
            )
          }
        </div>
        {
          mintStartTime && mintEndTime && displayTimer ? (
            <>
              {/* {
                displayTimer == mintStartTime && (
                  <TimerComponent
                    expiryTimestamp={displayTimer}
                    handleTimer={handleTimer}
                    content={content}
                  />
                )
              }
              {
                displayTimer == mintEndTime && (
                  <TimerComponent
                    expiryTimestamp={displayTimer}
                    handleTimer={handleTimer}
                    content={content}
                  />
                )
              } */}
              {
                displayTimer != mintStartTime && displayTimer != mintEndTime && (
                  <div className='mt-2 mb-3 text-center goldman-font'>

                    <div style={{ fontSize: '16px', color: 'cyan' }}>Minting round has ended, watch for future generations.</div>
                    <div className='mt-3 sm:mt-1' style={{ fontSize: '16px', color: 'cyan' }}>Venture to the outpost to purchase a ship.</div>
                  </div>
                )
              }
            </>
          ) : (
            ''
          )
        }


        {/* Mint not supported by contract anymore
        {
          displayTimer && mintEndTime && mintStartTime && (
            <div className="flex justify-center px-5 pt-3 pb-0 md:px-0">
              {
                  displayTimer == mintEndTime && (
                    <MintButton />
                  )
                }
            </div>
          )
        }*/}

        <div className="relative flex flex-wrap flex-auto overflow-hidden justify-center w-full px-10 inventory-filter-section">
          {
            fBox && filterData && (
              <FilterShips
                filterType="inventory"
              />
            )
          }
          <div ref={scrollable}
            className={cn("custom-sync", "h-full", "overflow-auto", {
              'inventory-filter': fBox === true
            })}
            style={{ width: fBox !== true && '100%' }}
          >
            <NFTList />
          </div>
        </div>
        <Pagination handlePagination={handlePagination} data={{ 'cur_pos': pagination }} pageName='inventory' />
      </div>
      <InventoryMobileFooter />
    </>
  )
}


Ships.Layout = Default