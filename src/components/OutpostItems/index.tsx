import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useShipListings } from '../../services/graph/hooks/deepspace'
import FilterShips from '../../components/FilterShips'
import Pagination from '../../components/Pagination'
import {
  useFilterBox,
  useFilterData,
  useFirstID,
  useLastID,
  useShipSelects,
  useUpdateFilterData,
  useUpdateFirstID,
  useUpdateLastID,
  useUpdateShipSelects
} from '../../state/others/hooks';
import 'animate.css';
import ShipCard from '../../components/ShipCard'
import SkeletonLoading from '../../components/SkeletonLoading'
import Scrollbar from "smooth-scrollbar";

export default function OutpostItem() {
  const filterData = useFilterData();
  const updateFilterData = useUpdateFilterData();
  const updateShipSelects = useUpdateShipSelects();
  const shipSelects = useShipSelects();
  const [pagination, setPagination] = useState(0);
  const [paginationPrevDirection, setPaginationPrevDirection] = useState(1);
  const [filterStatus, setFilterStatus] = useState(true); // change =>true, dischange =>false
  const fBox = useFilterBox();
  const updateLastID = useUpdateLastID();
  const updateFirstID = useUpdateFirstID();
  const [nextID, setNextID] = useState(null);
  const router = useRouter();
  const firstID = useFirstID();
  const lastID = useLastID();
  const { data: listingData, mutate: shipListingsMutate, error } = useShipListings(filterStatus, shipSelects, paginationPrevDirection, nextID, 'outpost');
  const routerQuery = router.query;

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
  }, [])

  useEffect(() => {
    updateFirstID(null);
    updateLastID(null);
    setFilterStatus(true);
    setPaginationPrevDirection(1);
    setPagination(0);
  }, [shipListingsMutate])

  useEffect(() => {
    updateFirstID(null);
    updateLastID(null);
    setFilterStatus(true);
    setPagination(0);
    setPaginationPrevDirection(1);
  }, [filterData, fBox])

  useEffect(() => {
    if (pagination != 0) setFilterStatus(false);
  }, [pagination]);

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

  const OutPostList = useCallback(() => {
    let shipData = [];
    const scrollable: RefObject<HTMLDivElement> = React.createRef()

    useEffect(() => {
      if (!!shipData && !!scrollable.current) {
        Scrollbar.init(scrollable.current, {continuousScrolling: false, alwaysShowTracks: true})
      }
    }, [shipData, scrollable])

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
      <div ref={scrollable} className="h-full">
        <div className={cn("inline-flex flex-wrap justify-center px-6 mt-5 w-full", {

        })}>
          {shipData && filterData && shipData.map((listing, key) => {
            listing = listing['listing'];
            const nft = listing['token'];
            return (
              <div className="px-3" key={key}>
                <ShipCard
                  cardType="shipsoutpost"
                  key={key}
                  nftData={nft}
                  price={listing['price']}
                  nftFullData={listing}
                />
              </div>
            )
          })}
        </div>
        {(!error && listingData?.length == 0) && (
          <div className="flex items-center justify-center w-full text-center"><span>No Matching NFTs</span></div>
        )}
        {
          error && (
            <div className="flex items-center justify-center w-full text-center"><span>NFT searching temporarily unavailable. Please try again later.</span></div>
          )
        }
        {
          listingData == null && !error && (
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
      </div>
    )
  }, [pagination, listingData, fBox, filterData, shipSelects, shipListingsMutate, error])

  return (
    <div className="flex flex-col justify-center w-full inventory-filter-section">
      <div className="flex flex-auto px-24 overflow-hidden">
        {
          fBox === true && filterData && (
            <FilterShips
              filterType="outpost"
            />
          )
        }

        <div className={cn("custom-sync", {
            'out-post-filter': fBox === true
          })}
          style={{ width: fBox !== true && '100%' }}

        >
          <OutPostList />
        </div>
      </div>
      <Pagination handlePagination={handlePagination} data={{ cur_pos: pagination }} pageName='outpost' />
    </div>
  )
}