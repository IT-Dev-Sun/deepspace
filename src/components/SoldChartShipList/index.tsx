import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { useFilterBox, useFilterData, useUpdateFilterData, useShipSelects, useUpdateShipSelects, useUpdateLastID, useUpdateFirstID, useFirstID, useLastID } from '../../state/others/hooks';
import { useShipListings } from '../../services/graph/hooks/deepspace'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
const ComponentStyle = styled.div`
    .mobile-section{
        display:none;
    }
    @media(max-width:1143px){
        .ship-list-section{
            display:block;
        }
        .ship-filter-section{
            width:100%;
        }
    }
    @media(max-width:992px){
        .desktop-section{
            display:none;
        }
        .mobile-section{
            display:block;
        }
    }
`

import FilterShips from '../FilterShips';
import SoldShipCardDeskTop from '../SoldShipCardDeskTop';
import SoldShipCardMobile from '../SoldShipCardMobile';
import Pagination from '../Pagination';

export default function SoldChartShipList() {
    const filterData = useFilterData();
    const { account } = useActiveWeb3React();
    const updateFilterData = useUpdateFilterData();
    const updateShipSelects = useUpdateShipSelects();
    const shipSelects = useShipSelects();
    const [pagination, setPagination] = useState(0);
    const [filterStatus, setFilterStatus] = useState(true); // change =>true, dischange =>false
    const [listingData, setListingData] = useState(null);
    const fBox = useFilterBox();
    const [paginationPrevDirection, setPaginationPrevDirection] = useState(1);
    const updateLastID = useUpdateLastID();
    const updateFirstID = useUpdateFirstID();
    const [nextID, setNextID] = useState(null);
    const firstID = useFirstID();
    const lastID = useLastID();
    const queryType = filterData.newListing ? (filterData.myListing ? 'outpostMyListing' : 'outpostNewListing') : (filterData.mySale ? 'outpostMySale' : 'outpostSale');
    const { data: fetchData, mutate: shipListingsMutate, error } = useShipListings(filterStatus, shipSelects, paginationPrevDirection, nextID, queryType);

    useEffect(() => {
        if (fetchData) {
            let shipData = [];
            if (fetchData) shipData = [...fetchData];

            if (paginationPrevDirection != 1 && fetchData) {
                shipData = [...fetchData].reverse()
                if (shipData && shipData.length == shipSelects + 1) {
                    shipData.shift();
                }
            } else {
                if (shipData && shipData.length == shipSelects + 1) {
                    shipData.splice(-1, 1);
                }
            }
            setListingData(shipData);
        }
    }, [fetchData, shipListingsMutate])
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
    const handleUpdateShipSelets = (value) => {
        updateShipSelects(value);
        setPagination(0);
        setFilterStatus(true);
    }
    const handlePagination = (dir) => {
        if (!fetchData || (fetchData.length != shipSelects + 1 && dir > 0)) {
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
    return (
        <ComponentStyle className='w-full'>
            <div className='flex justify-center ship-list-section'>
                {
                    fBox && (
                        <div className='flex flex-wrap justify-center mt-7 ship-filter-section'>
                            <FilterShips
                                filterType='outpostActivity'
                            />
                        </div>
                    )
                }
                {
                    listingData && listingData.length ? (
                        <>
                            <div className='w-full pl-3 mt-10 mb-12 desktop-section'>
                                <SoldShipCardDeskTop listingData={listingData} filterType={queryType} />
                            </div>
                            <div className='w-full mt-10 mb-12 mobile-section'>
                                <SoldShipCardMobile listingData={listingData} filterType={queryType} />
                            </div>
                        </>
                    ) : ('')
                }
                {
                    (!listingData && !error) ? (
                        <div className='w-full my-10 text-center'>Loading...</div>
                    ) : ('')
                }
                {

                    (listingData && listingData.length == 0) ? (
                        <div className='w-full my-10 text-center'>No Matching Data</div>
                    ) : ('')
                }
                {
                    (error && !listingData && account) ? (
                        <div className='w-full my-10 text-center'>Genesis Server Error. Please wait a while</div>
                    ) : ('')
                }
                {

                    (error && !listingData && !account && queryType === 'outpostMySale') ? (
                        <div className='w-full my-10 text-center'>Please connect wallet to view "My Sales"</div>
                    ) : ('')
                }
            </div>
            <Pagination handlePagination={handlePagination} data={{ cur_pos: pagination }} pageName='outpost' />
        </ComponentStyle>
    )

}