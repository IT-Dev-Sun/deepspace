import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import 'react-multi-carousel/lib/styles.css'
import Pagination from '../../components/Pagination'
import MobileFooter from '../../components/MobileFooter'
import ChooseShip from './components/ship-choose'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { setAllShips, setCurrentShip } from '../../state/shipyard/actions'

import TabResource from './components/tab-resource'
import ShipAllowableUpgrade from './components/ship-allowable-upgrade'
import SelectedResource from './components/selected-resources'
import ShipDetail from './components/ship-detail'

import { shipDataByAccount } from '../../services/graph/hooks/deepspace'
import Default from "../../layouts/Default";
import TransparentNavbar from "../../components/TransparentNavbar";

const PageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .mobileDevice {
    display: none;
  }
  @media(max-device-width:820px) {
    .ship_resource_container {
      float: none !important;
      margin: 0 auto;
      margin-left: auto !important;
      width: 370px !important;
    }
    .mobileDevice {
      display: block;
    }
    .comDevice {
      display: none;
    }
  }
  .containForm>div {
    float: left;
  }
  .containForm>.comDevice>div {
    float: left;
  }
  .clearFix {
    both: clear;
  }
`;

export default function ShipYard() {

  const dispatch = useDispatch<AppDispatch>()
  const [pagination, setPagination] = useState(0);

  const { data: shipData } = shipDataByAccount();
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (shipData?.length > 0) {
      dispatch(setAllShips(shipData))
      dispatch(setCurrentShip(shipData[0]))
    }
  }, [shipData])

  const handlePagination = () => {
  }

  return (
    <PageStyle>
      <TransparentNavbar navType="shipyard" />
      {account ? (
        <>
          <div className="flex flex-auto items-center justify-center">
            <div className='containForm'>
              <ChooseShip />
              <div className='flex flex-col ship_resource_container' style={{ marginLeft: 20 }}>
                <ShipAllowableUpgrade />
                <SelectedResource />
              </div>
              <div className='comDevice'>
                <ShipDetail />
                <TabResource />
              </div>
              <div className='mobileDevice'>
                <TabResource />
                <ShipDetail />
              </div>
              <div className='clearFix'></div>
            </div>
          </div>
          <Pagination handlePagination={handlePagination} data={{ 'cur_pos': pagination }} pageName='shipyard' />
          <MobileFooter />
        </>
      ) : (
        <div>Please Connect Wallet</div>
      )}

    </PageStyle>

  )
}

ShipYard.Layout = Default