import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components'
import FilterImage from '../../asset/image/filter.svg'
import StakingFilterImage from '../../asset/image/staking_filter.svg'
import FilterCloseImage from '../../asset/image/filter_close.svg'
import { FILTER_DATA, SHIP_CORE_TYPES, SHIP_SELECT_LIST, SHIP_TYPES, STAT_NAMES, TextureColors } from '../../constants'
import Image from 'next/image'
import Switch from 'react-switch'
import 'react-rangeslider/lib/index.css'
import { FaSortAmountDownAlt, FaSortAmountUp } from 'react-icons/fa';
import cn from 'classnames';
import {
    useFilterData,
    useRemoveFilterBox,
    useRemoveFilterData,
    useShipSelects,
    useUpdateFilterData,
    useUpdateShipSelects
} from '../../state/others/hooks';
import { CgRadioChecked } from 'react-icons/cg'
import { RiCloseCircleFill } from 'react-icons/ri'
import StarRatingComponent from 'react-star-rating-component';
import { isString } from 'lodash'

const StyledFilter = styled.div`
    .acitve-filter-msg{
        padding:6px 12px;
        background-color:#d1d5db;
        font-size:12px;
        border-radius:4px;
        color:white;
        cursor:not-allowed;
        font-weight:bold;
        background-color:#d200ad;
        transition:1s;
    }
    .filter-ship{
        width:263px;
        height:537px;
        min-width: 263px;
    }
    .staking-filter{
        height:480px;
    }
    .fitler-status{
        animation-name:filterStatus;
        animation-duration:2s;
        animation-iteration-count: infinite;
    }
    .label-width{
        width:87px;
    }
    .texture-section{
        margin:0px 3px;
        overflow:hidden;
        transition:.3s;
        width:16px;
        height:16px; 
    }
    .texture-section:hover{
        box-shadow:0px 0px 2px 4px #cfcece;
    }
    .texture-active{
        box-shadow:0px 0px 2px 4px #cfcece;
    }
    .ship-rating{
        line-height:0.87;
    }
    .ship-rating .dv-star-rating{
        font-size:26px;
        display:flex!important;
        flex-direction: row-reverse;
        align-items:center;
    }
    @keyframes filterStatus{
        25%{
            transform:scale(1.5);
        }
        50%{
            transform:scale(1);
        }
        75%{
            transform:scale(1.5);
        }
        100%{
            transform:scale(1);
        }
    }
`;
interface FilterShipsProps {
    filterType: 'outpost' | 'inventory' | 'staking' | 'outpostActivity'
}
const FilterShips: React.FC<FilterShipsProps> = ({ filterType }) => {
    const colorArray = ['#ff00d9', '#00BDFF', '#f17500', 'yellow', 'red']
    const removeFilterData = useRemoveFilterData();
    const filterData = useFilterData();
    let compareData = { ...filterData };
    compareData.sortType = 'initial';
    compareData.shipStatus = filterType === 'staking' ? 0 : compareData.shipStatus;
    const updateFilterData = useUpdateFilterData();
    const shipSelects = useShipSelects();
    const updateShipSelects = useUpdateShipSelects();
    const removeFilterBox = useRemoveFilterBox();
    const router = useRouter();
    const handleReset = () => {
        if (filterType === 'staking') {
            let d = { ...FILTER_DATA };
            d.shipStatus = 4;
            updateFilterData({ ...d });
        } else {
            removeFilterData();
        }
        router.push({ query: {} })
    }
    const handleRating = (nextValue, preValue, name) => {
        handleOnChange(Number(nextValue), 'star')
    }
    const handleStarReSet = () => {
        handleOnChange(0, 'star');
    }
    const handleTextureReSet = () => {
        handleOnChange(-1, 'textureType');
    }
    const handleOnChange = (value, name) => {
        let data = filterData;
        value = isString(value) ? value.trim() : value;
        value = (Number(value) === null || value === '') ? value : Number(value)
        if (name === 'minPrice' || name === 'minStatus' || name === 'minShipLevel') {
            if (name === 'minStatus' && value > 100) value = 100;
            if (name === 'minShipLevel' && value > 570) value = 570;
            value = (isNaN(value) || value === '') ? '' : value;
        }
        if (name === 'maxPrice' || name === 'maxStatus' || name === 'maxShipLevel') {
            value = (isNaN(value) || value === '') ? '' : value;
            if (name === 'maxStatus' && value > 100) value = 100;
            if (name === 'maxShipLevel' && value > 570) value = 570;
        }

        if (name === 'priceUp' || name === 'shipStatsUp' || name === 'shipLevelUp' || name === 'starUp' || name === 'textureTypeUp') {
            updateFilterData({ ...data, sortType: name, [name]: value });
            router.push({
                query: { ...data, sortType: name, [name]: value }
            })
        } else {
            if (name === 'minPrice' || name == "maxPrice") {
                updateFilterData({ ...data, sortType: "priceUp", [name]: value });
                router.push({
                    query: { ...data, sortType: "priceUp", [name]: value }
                })
            }
            else if (name === 'minStatus' || name === 'maxStatus' || name === 'shipStatus') {
                updateFilterData({ ...data, sortType: "shipStatsUp", [name]: value });
                router.push({
                    query: { ...data, sortType: "shipStatsUp", [name]: value }
                })
            } else if (name === 'minShipLevel' || name === 'maxShipLevel') {
                updateFilterData({ ...data, sortType: "shipLevelUp", [name]: value });
                router.push({
                    query: { ...data, sortType: "shipLevelUp", [name]: value }
                })
            }
            else if (name === 'star') {
                if (value != 0) {
                    if (data.sortType === 'starUp') {
                        updateFilterData({ ...data, sortType: "initial", [name]: value });
                        router.push({
                            query: { ...data, sortType: "initial", [name]: value }
                        })
                    } else {
                        updateFilterData({ ...data, [name]: value });
                        router.push({
                            query: { ...data, [name]: value }
                        })
                    }
                } else {
                    updateFilterData({ ...data, sortType: "starUp", [name]: value });
                    router.push({
                        query: { ...data, sortType: "starUp", [name]: value }
                    })
                }
            } else if (name === 'textureType') {
                if (value != -1) {
                    if (data.sortType === 'textureTypeUp') {
                        updateFilterData({ ...data, sortType: "initial", [name]: value });
                        router.push({
                            query: { ...data, sortType: "initial", [name]: value }
                        })
                    } else {
                        updateFilterData({ ...data, [name]: value });
                        router.push({
                            query: { ...data, [name]: value }
                        })
                    }
                } else {
                    updateFilterData({ ...data, sortType: "textureTypeUp", [name]: value });
                    router.push({
                        query: { ...data, sortType: "textureTypeUp", [name]: value }
                    })
                }
            } else if (name === 'newListing') {
                if (value) {
                    updateFilterData({ ...data, [name]: value, 'mySale': false });
                    router.push({
                        query: { ...data, [name]: value, 'mySale': false }
                    })
                } else {
                    updateFilterData({ ...data, [name]: value, 'myListing': false });
                    router.push({
                        query: { ...data, [name]: value, 'myListing': false }
                    })
                }
            }
            else {
                updateFilterData({ ...data, [name]: value });
                router.push({
                    query: { ...data, [name]: value }
                })
            }
        }
    }
    const handleSetFBox = () => {
        removeFilterBox();
    }
    useEffect(() => {
        if (filterType === 'staking') {
            // handleOnChange(4, "shipStatus");
            let data = filterData;
            updateFilterData({ ...data, shipStatus: 4 });
        }
    }, [])
    return (
        <StyledFilter>
            <div className={cn("filter-ship relative flex justify-center mt-5", {
                'staking-filter mt-2': filterType === 'staking'
            })} style={{ fontSize: '14px' }}>
                <div>
                    <Image alt={'filterImage'} src={filterType === 'staking' ? StakingFilterImage : FilterImage} layout='fill' />
                    <div className="absolute z-10 cursor-pointer" style={{ 'right': `${filterType === 'staking' ? '19px' : '13px'}`, 'top': `${filterType === 'staking' ? '44px' : '38px'}` }} onClick={() => handleSetFBox()}>
                        <Image alt={'closeIcon'} src={FilterCloseImage} layout="fixed" width={18} height={18} />
                    </div>
                </div>
                <div className="absolute w-10/12 mt-5 text-center">
                    {
                        filterType !== 'staking' ? (
                            <div className='w-full'>
                                <h3 className="mt-10 mb-2 text-xl font-bold text-center text-bold">Filter</h3>
                                <h4 className={cn("text-bold text-base text-center mb-1 mt-5 font-bold", {})} >Status</h4>
                                <div className={cn("flex", {
                                    'justify-around': filterType === 'inventory',
                                    'justify-center': filterType === 'outpost' || filterType === 'outpostActivity'
                                })}>
                                    {
                                        filterType === 'outpostActivity' ? (
                                            <div className='flex justify-between w-full'>
                                                <div>
                                                    <label className="flex items-center">
                                                        <span className="mr-1 text-sm">Sale</span>
                                                        <Switch onChange={() => { handleOnChange(filterData.newListing ^ 1, 'newListing') }} checked={filterData.newListing ? true : false} offColor={'#C7C7CC'} onColor={'#6F1DF4'} checkedIcon={false} uncheckedIcon={false} height={14} width={30} handleDiameter={16} />
                                                        <span className="ml-1 text-sm">Listing</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    {
                                                        filterData.newListing ? (
                                                            <label className="flex items-center">
                                                                <Switch onChange={() => { handleOnChange(filterData.myListing ^ 1, 'myListing') }} checked={filterData.myListing ? true : false} offColor={'#C7C7CC'} onColor={'#6F1DF4'} checkedIcon={false} uncheckedIcon={false} height={14} width={30} handleDiameter={16} />
                                                                <span className="ml-1 text-sm">My Listing</span>
                                                            </label>
                                                        ) : (
                                                            <label className="flex items-center">
                                                                <Switch onChange={() => { handleOnChange(filterData.mySale ^ 1, 'mySale') }} checked={filterData.mySale ? true : false} offColor={'#C7C7CC'} onColor={'#6F1DF4'} checkedIcon={false} uncheckedIcon={false} height={14} width={30} handleDiameter={16} />
                                                                <span className="ml-1 text-sm">My Sale</span>
                                                            </label>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={cn('flex w-full', {
                                                'justify-around': filterType === 'inventory',
                                                'justify-center': filterType === 'outpost'
                                            })}>

                                                <div>
                                                    <label className="flex items-center">
                                                        <Switch onChange={() => { handleOnChange(filterData.newItem ^ 1, 'newItem') }} checked={filterData.newItem ? true : false} offColor={'#C7C7CC'} onColor={'#6F1DF4'} checkedIcon={false} uncheckedIcon={false} height={14} width={30} handleDiameter={16} />
                                                        <span className="ml-2 text-sm">New</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    {
                                                        filterType === 'inventory' && (
                                                            <label className="flex items-center">
                                                                <Switch onChange={() => { handleOnChange(filterData.listed ^ 1, 'listed') }} checked={filterData.listed ? true : false} offColor={'#C7C7CC'} onColor={'#6F1DF4'} checkedIcon={false} uncheckedIcon={false} height={14} width={30} handleDiameter={16} />
                                                                <span className="ml-2 text-sm">Listed</span>
                                                            </label>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                        )
                                    }
                                </div>
                            </div>
                        ) : (
                            <h3 className="mt-12 mb-2 text-xl font-bold text-center text-bold ">Filter</h3>
                        )
                    }
                    <h4 className={cn("text-bold text-base text-center font-bold", {
                        'mb-3 mt-8': filterType !== 'staking' && filterType === 'inventory',
                        'mb-3 mt-5': filterType !== 'staking' && (filterType === 'outpost' || filterType === 'outpostActivity'),
                        'mb-5 mt-7': filterType === 'staking'
                    })} >Ship Properties</h4>
                    <div className={cn("flex items-center", {
                        'mb-5': filterType === 'staking',
                        'mb-4': filterType !== 'staking' && filterType === 'inventory',
                        'mb-3': filterType !== 'staking' && (filterType === 'outpost' || filterType === 'outpostActivity'),
                    })}>
                        <div className="text-sm label-width">Ship View</div>
                        <div className="text-sm">
                            <select className="text-sm text-center text-black bg-gray-300 rounded" value={shipSelects} onChange={(e) => updateShipSelects(Number(e.target.value))} style={{ 'padding': "3px 12px" }}>
                                {
                                    SHIP_SELECT_LIST.map((val, key) => {
                                        return <option value={val} key={key}>{val}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    {
                        filterType === 'outpost' || filterType === 'outpostActivity' ? (
                            <div className="flex items-center mb-1">
                                <div className="text-sm label-width">Price</div>
                                <div className="flex items-center">
                                    <div>
                                        <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.minPrice} onChange={(e) => { handleOnChange(e.target.value, 'minPrice') }} style={{ 'padding': "3px 0px" }} placeholder="min" />
                                    </div>
                                    <div className="ml-2">
                                        <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.maxPrice} onChange={(e) => { handleOnChange(e.target.value, 'maxPrice') }} style={{ 'padding': "3px 0px" }} placeholder="max" />
                                    </div>
                                    <div className="ml-2 text-xl cursor-pointer" style={{ 'color': "#D400A6" }}>
                                        {
                                            filterData.priceUp === 1 ? <FaSortAmountDownAlt onClick={() => handleOnChange(-1, 'priceUp')} /> : <FaSortAmountUp onClick={() => handleOnChange(1, 'priceUp')} />
                                        }
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div className="mt-5"></div>
                        )
                    }
                    {
                        filterType !== 'staking' ? (
                            <div className="flex items-center mb-1">
                                <div className="text-sm label-width">Ship Level</div>
                                <div className="flex items-center">
                                    <div>
                                        <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.minShipLevel} onChange={(e) => { handleOnChange(e.target.value, 'minShipLevel') }} style={{ 'padding': "3px 0px" }} placeholder="min" />
                                    </div>
                                    <div className="ml-2">
                                        <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.maxShipLevel} onChange={(e) => { handleOnChange(e.target.value, 'maxShipLevel') }} style={{ 'padding': "3px 0px" }} placeholder="max" />
                                    </div>
                                    <div className="ml-2 text-xl cursor-pointer" style={{ 'color': "#D400A6" }}>
                                        {
                                            filterData.shipLevelUp === 1 ? <FaSortAmountDownAlt onClick={() => handleOnChange(-1, 'shipLevelUp')} /> : <FaSortAmountUp onClick={() => handleOnChange(1, 'shipLevelUp')} />
                                        }
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div className="mt-5"></div>
                        )
                    }

                    <div className={cn("flex items-center", {
                        'mb-5': filterType === 'staking',
                        'mb-2': filterType !== 'staking' && filterType === 'inventory',
                        'mb-1': filterType !== 'staking' && (filterType === 'outpost' || filterType === 'outpostActivity'),
                    })}>
                        <div className="text-sm label-width">Ship Class</div>
                        <div className="text-sm">
                            <select className="text-sm text-center text-black bg-gray-300 rounded" onChange={(e) => { handleOnChange(e.target.value, 'shipClass') }} style={{ 'padding': "3px" }}>
                                <option value={-1}> All</option>
                                {
                                    SHIP_TYPES && SHIP_TYPES.map((type, key) => {
                                        if (key == Number(filterData.shipClass)) return <option value={key} style={{ 'padding': "3px" }} key={key} selected>{type}</option>
                                        else return <option value={key} style={{ 'padding': "3px" }} key={key}>{type}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className={cn("flex items-center", {
                        'mb-5': filterType === 'staking',
                        'mb-2': filterType !== 'staking' && filterType === 'inventory',
                        'mb-1': filterType !== 'staking' && (filterType === 'outpost' || filterType === 'outpostActivity'),
                    })}>
                        <div className="text-sm label-width">Core Type</div>
                        <div className="text-sm">
                            <select className="text-sm text-center text-black bg-gray-300 rounded" onChange={(e) => { handleOnChange(e.target.value, 'coreType') }} style={{ 'padding': "3px" }}>
                                <option value={-1}>All</option>
                                {
                                    SHIP_CORE_TYPES.map((type, key) => {
                                        if (key == filterData.coreType) return <option value={key} key={key} selected>{type}</option>
                                        else return <option value={key} key={key}>{type}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    {
                        filterType !== 'staking' && (
                            <div className="w-full">
                                <div className="flex items-center mb-1">
                                    <div className="text-sm label-width">Ship Stats</div>
                                    <div className="text-sm">
                                        <select className="text-sm text-center text-black bg-gray-300 rounded" onChange={(e) => { handleOnChange(e.target.value, 'shipStatus') }} style={{ 'padding': "3px" }}>
                                            {
                                                STAT_NAMES && STAT_NAMES.map((type, key) => {
                                                    if (key == filterData.shipStatus) return <option value={key} key={key} selected>{type}</option>
                                                    else return <option value={key} key={key}>{type}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center mb-1">
                                    <div className="label-width"></div>
                                    <div className="flex items-center">
                                        <div>
                                            <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.minStatus} onChange={(e) => { handleOnChange(e.target.value, 'minStatus') }} style={{ 'padding': "3px 0px" }} placeholder="min" />
                                        </div>
                                        <div className="ml-2">
                                            <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.maxStatus} onChange={(e) => { handleOnChange(e.target.value, 'maxStatus') }} style={{ 'padding': "3px 0px" }} placeholder="max" />
                                        </div>
                                        <div className="ml-2 text-xl cursor-pointer" style={{ 'color': "#D400A6" }}>
                                            {
                                                filterData.shipStatsUp === 1 ? <FaSortAmountDownAlt onClick={() => handleOnChange(-1, 'shipStatsUp')} /> : <FaSortAmountUp onClick={() => handleOnChange(1, 'shipStatsUp')} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        filterType === 'staking' && (
                            <div className='flex items-end'>
                                <div className="text-sm label-width">Luck Stat</div>
                                <div>
                                    <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.minStatus} onChange={(e) => { handleOnChange(e.target.value, 'minStatus') }} style={{ 'padding': "3px 0px" }} placeholder="min" />
                                </div>
                                <div className="ml-2">
                                    <input type='text' className="w-10 text-sm text-center text-black bg-gray-300 rounded input" value={filterData.maxStatus} onChange={(e) => { handleOnChange(e.target.value, 'maxStatus') }} style={{ 'padding': "3px 0px" }} placeholder="max" />
                                </div>

                                <div className="ml-2 text-xl cursor-pointer" style={{ 'color': "#D400A6" }}>
                                    {
                                        filterData.shipStatsUp === 1 ? <FaSortAmountDownAlt onClick={() => handleOnChange(-1, 'shipStatsUp')} /> : <FaSortAmountUp onClick={() => handleOnChange(1, 'shipStatsUp')} />
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className={cn("flex mt-2", {
                        'mt-5': filterType === 'staking',
                        'mb-2': filterType !== 'staking' && filterType === 'inventory',
                        'mb-1': filterType !== 'staking' && (filterType === 'outpost' || filterType === 'outpostActivity'),
                    })}>
                        <div className="flex items-end justify-center w-4/12 text-sm"><span>Rating</span></div>
                        <div className="w-8/12 ml-3">
                            <div className="flex items-end">
                                <div className='ship-rating'>
                                    {/* <Rating
                                        onClick={handleRating}
                                        initialValue={data.star}
                                        ratingValue={rating}
                                        size={22}
                                        fillColor={colorArray[data.star - 1]}
                                        fillColorArray={colorArray}
                                    /> */}
                                    <StarRatingComponent
                                        name="shipRating"
                                        starCount={5}
                                        value={filterData.star}

                                        emptyStarColor={'#D1D5DB'}
                                        onStarClick={handleRating}
                                    />
                                </div>
                                <div className="w-2/12 ml-2 text-xl text-right cursor-pointer" style={{ 'color': "#D400A6" }}>
                                    {
                                        (filterData.star == 0) ? (
                                            filterData.starUp === 1 ? <FaSortAmountDownAlt onClick={() => handleOnChange(-1, 'starUp')} /> : <FaSortAmountUp onClick={() => handleOnChange(1, 'starUp')} />
                                        ) : (
                                            <RiCloseCircleFill onClick={() => { handleStarReSet() }} />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cn("flex items-center mb-3", {
                        'mt-2 mb-3': filterType === 'staking',
                        'mb-2': filterType !== 'staking' && filterType === 'inventory',
                        'mb-1': filterType !== 'staking' && (filterType === 'outpost' || filterType === 'outpostActivity'),
                    })}>
                        <div className="flex items-end justify-center w-4/12 text-sm"><span>Texture</span></div>
                        <div className='w-8/12 ml-3'>

                            <div className="flex items-center text-sm w-76">
                                <div className='flex w-full'>
                                    {
                                        TextureColors.map((color, key) => {
                                            return (
                                                <div key={key} className={`texture-section rounded-full cursor-pointer ${key == filterData.textureType ? 'texture-active' : ''}`} onClick={() => handleOnChange(key, 'textureType')} style={{ backgroundColor: color }}></div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="w-3/12 ml-2 text-xl text-left cursor-pointer" style={{ 'color': "#D400A6" }}>
                                    {
                                        (filterData.textureType == -1) ? (
                                            filterData.textureTypeUp == 1 ? <FaSortAmountDownAlt onClick={() => handleOnChange(-1, 'textureTypeUp')} /> : <FaSortAmountUp onClick={() => handleOnChange(1, 'textureTypeUp')} />
                                        ) : (
                                            <RiCloseCircleFill onClick={() => { handleTextureReSet() }} />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cn('flex w-full',
                        {
                            'justify-between': JSON.stringify(compareData) != JSON.stringify(FILTER_DATA),
                            'justify-end': JSON.stringify(compareData) == JSON.stringify(FILTER_DATA),
                            'mt-5': filterType === 'staking',
                            'mt-2': filterType !== 'staking'
                        }
                    )}>
                        {
                            (JSON.stringify(compareData) != JSON.stringify(FILTER_DATA)) && (
                                <div className="acitve-filter-msg">

                                    <div className="flex items-center">
                                        <CgRadioChecked className="fitler-status" style={{ color: "white", fontSize: "14px" }} />
                                        <span style={{ fontSize: '11px' }}>&nbsp;Filter Active</span>
                                    </div>
                                </div>
                            )
                        }
                        <button type={'button'} className="relative btn btn-primary reset-filter" onClick={() => { handleReset() }}>
                            <span className='reset-filter-before'></span>
                            <span>Reset</span>
                        </button>

                    </div>
                </div>
            </div>
        </StyledFilter>
    )
}
export default FilterShips