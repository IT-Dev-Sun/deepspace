import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Indicator from "./indicator";
import RestartBuild from './restart-build'
import { useActiveWeb3React } from '../../../hooks'
import ShipyardSalvageModal from '../../../components/Modal/ShipyardSalvageModal'
import ShipyardUpgradeModal from '../../../components/Modal/ShipyardUpgradeModal'
import { AppDispatch } from '../../../state'
import { useDispatch, useSelector } from 'react-redux'
import { setRequiredResources, setLevelIncreases, setCurrentShip } from '../../../state/shipyard/actions'
import { RESOURCE_LIST } from '../../../constants/deepspace'
import { shipDataByAccount } from '../../../services/graph/hooks/deepspace'
import { ToastContainer } from 'react-toastr';


const PageStyle = styled.div`
  width: 382px;
  margin-left: 20px;
  margin-right: 20px;
  @media(max-device-width:820px) {
    margin-bottom: 100px;
  }
  .ship-detail-container {
    width: 85%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 595px;
  }
  .container {
    width: 100%;
    display: flex;
    align-items: flex-end;
  }

  .action_container {
    display: flex;
    width: 100%;
    background: linear-gradient(153deg, transparent 15px, rgba(3, 58, 78, 0.85) 0) top left, linear-gradient(205deg, transparent 15px, rgba(3, 58, 78, 0.85) 0) top right;
    background-size: 50% 100%;
    background-repeat: no-repeat;
    border-bottom: 2px solid #00aeef;
    justify-content: space-evenly;
    padding: 20px 0px 10px 0px;
    position: relative;
    overflow-x: clip;
  }

  .top_left_corner {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    margin-left: -8px;
    margin-top: -11px;
    border-bottom: 2px solid #00aeef;
    width: 42px;
    transform: rotate(335deg);
  }

  .top_right_corner {
    position: absolute;
    top: 0;
    right: 0;
    height: 20px;
    margin-right: -8px;
    margin-top: -11px;
    border-bottom: 2px solid #00aeef;
    width: 42px;
    transform: rotate(25deg);
  }

  .left_border {
    position: absolute;
    left: 0;
    bottom: 0;
    margin-bottom: -2px;
    border-left: 2px solid #00aeef;
    height: calc(100% - 14px);
  }

  .right_border {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-bottom: -2px;
    border-right: 2px solid #00aeef;
    height: calc(100% - 14px);
  }
  .top_border {
    position: absolute;
    top: 0;
    margin-top: -2px;
    border-top: 2px solid #00aeef;
    width: calc(100% - 72px);
  }

  .button {
    padding: 8px;
    cursor: pointer;
  }
  .bottomBtnGroup {
    height: 57px;
    background: url('/images/shipyard/bottom.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    &>div {
      padding: 3px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 3px;
      margin-top: 10px;
      font-size: 12px;
      cursor: pointer;
      &:first-child {
        background: url('/images/shipyard/button2.png');
        background-size: 100% 100%;
        background-position: center center;
        background-repeat: no-repeat;
      }
      &:nth-child(2) {
        background: url('/images/shipyard/button3.png');
        background-size: 100% 100%;
        background-position: center center;
        background-repeat: no-repeat;
      }
      &:last-child {
        background: url('/images/shipyard/button1.png');
        background-size: 100% 100%;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
  }
`



const ShipDetail = (props) => {
  let container;
  const dispatch = useDispatch<AppDispatch>()
  const [c, setC] = useState(null)
  const { account } = useActiveWeb3React()
  const { data: shipData } = shipDataByAccount();
  const { avail_resources, required_resources } = useSelector((state: any) => state.shipyard)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSalvageModal, setShowSalvageModal] = useState(false)

  useEffect(() => {
    setC(container);
  }, [container])

  const onCloseUpgrade = () => {
    setShowUpgradeModal(false)
  }

  const showToastr = (status) => {
    if (c) {
      if (status === 'needResources') c.error("Available resources should match the required resources.", "Error");
    }
  }

  const handleUpgrade = () => {

    let checkValidate = []
    avail_resources.map((availResourceItem, index) => {
      required_resources.map((requiredResourceItem, key) => {
        if (index === key) {
          if (availResourceItem.quantity < requiredResourceItem.quantity) {
            checkValidate.push(availResourceItem)
          }
        }
      })
    })
    if (checkValidate.length > 0) {
      showToastr('needResources')
    } else {
      setShowUpgradeModal(true)
    }
  }

  const onCloseSalvage = () => {
    setShowSalvageModal(false)
  }

  const handleSalvage = () => {
    setShowSalvageModal(true)
  }

  const handleRestart = () => {
    getInitialResources()
    dispatch(setLevelIncreases([0, 0, 0, 0, 0, 0, 0, 0]))
    dispatch(setCurrentShip(shipData[0]))
  }

  const getInitialResources = async () => {
    let require_resources = []
    RESOURCE_LIST.map((item: any, index: number) => {
      const netItem = { ...item, quantity: 0 }
      require_resources.push(netItem)
    })
    dispatch(setRequiredResources(require_resources))
  }

  return (
    <PageStyle >
      <div className="ship-detail-container goldman-font">
        <div className="flex justify-center detail-content">
          <RestartBuild />
        </div>
        <div className={"container bottomBtnGroup"}>
          <div onClick={handleSalvage}>SALVAGE</div>
          <div onClick={handleUpgrade}>UPGRADE</div>
          <div onClick={handleRestart}>RESTART</div>
        </div>
      </div>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />

      {account && (
        <ShipyardSalvageModal show={showSalvageModal} onClose={() => onCloseSalvage()} />
      )}
      {account && (
        <ShipyardUpgradeModal show={showUpgradeModal} onClose={() => onCloseUpgrade()} />
      )}
    </PageStyle >
  )
}

export default ShipDetail   