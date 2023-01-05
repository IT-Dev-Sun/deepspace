import React, { useEffect, useState } from 'react'
import ShipAttributePlus from '../../../components/ShipAttribute/ShipAttributePlus'
import { SHIP_NUM_CORES, SHIP_TYPE_RANGE, STAT_TYPES } from '../../../constants'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../state'
import { plusStatByIndex, minusStatByIndex, setLevelIncreases, setRequiredResources } from '../../../state/shipyard/actions'
import { useDpsShipyardContract } from '../../../hooks'
import { ToastContainer } from 'react-toastr';


const PageStyle = styled.div`
  .shipyard-card-upgrade {
    width: 100%;
    position: relative;
  }
  .salvage-ship {
    text-align: center;
    border-radius: 10px;
  }
  .range-input {
    background: #021a22;
    color: #ffffff;
    padding-left: 24px;
    width: 127px;
    height: 30px;
    border: solid 1px #006f98;
    @media (max-height: 900px) {
      width: 100px;
      height: 25px;
    }
    @media (max-height: 800px) {
      width: 93px;
      height: 27px;
      padding-left: 10px;
    }
  }
  .w-1/2.pl-4.pr-4 {
    transform: translateX(20px);
  }
  .flex.mt-4.progress-container{
    margin-top: 1rem;
    @media (max-height: 900px) {
      margin-top: 7px;
    }
    @media (max-height: 800px) {
      margin-top: 10px;
    }
  }
  .ship-info {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .progress-container>div:last-child {
    padding-left: 0 !important;
    margin-left: 10px !important;
  }
`

const UpgradeCard = (props) => {

  let container;
  const dispatch = useDispatch<AppDispatch>()
  const dpsShipyardContract = useDpsShipyardContract()
  const [c, setC] = useState(null)
  const [levelUps, setLevelUps] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [maxRange, setMaxRange] = useState(0)
  const { currentShip, levelIncreases, required_resources } = useSelector((state: any) => state.shipyard)

  useEffect(() => {
    setC(container);
  }, [container])

  useEffect(() => {
    if (currentShip) {
      SHIP_NUM_CORES.map((core) => {
        if (currentShip.ship.numCores === core.quantity) {
          setMaxRange(core.highest)
        }
      })
    }
  }, [currentShip])

  useEffect(() => {
    getRequiredResources(levelIncreases)
  }, [levelIncreases])

  useEffect(() => {
    dispatch(setLevelIncreases([0, 0, 0, 0, 0, 0, 0, 0]))
  }, [])


  const showToastr = (status) => {
    if (c) {
      if (status === 'needmorecores') c.error("You’ve reached the max you can upgrade this stat without adding additional energy cores to the ship.", "Error");
      if (status === 'maxRangeLimit') c.error("Upgrade stat was limited.", "Error");
    }
  }
  const getRequiredResources = async (levelIncreases) => {
    if (dpsShipyardContract) {
      const resouces = await dpsShipyardContract.getUpgradeRequirements(currentShip?.ship?.tokenId, levelIncreases)
      let calRequiredResources = [];
      required_resources.map((resource, index) => {
        const netResource = { ...resource, quantity: resouces[index].toNumber() }
        calRequiredResources.push(netResource)
      })
      dispatch(setRequiredResources(calRequiredResources))
    }
  }

  const handleClick = (index, value, max) => {
    if (currentShip.ship.stats[index] >= max) {
      showToastr('maxRangeLimit')
    } else {
      if (currentShip.ship.stats[index] >= maxRange) {
        showToastr('needmorecores')
      } else {
        let levels = [...levelIncreases];
        levels[index] = levels[index] + 1;
        dispatch(plusStatByIndex(index))
        dispatch(setLevelIncreases(levels))
      }
    }

    // if (currentShip.ship.stats[index] >= maxRange || currentShip.ship.stats[index] >= max) {
    //   showToastr('rangeLimit')
    // } else {
    //   let levels = [...levelIncreases];
    //   levels[index] = levels[index] + 1;
    //   dispatch(plusStatByIndex(index))
    //   dispatch(setLevelIncreases(levels))
    // }
  }

  const handleClickMinus = (index) => {
    let levels = [...levelIncreases];
    levels[index] = levels[index] - 1;
    dispatch(minusStatByIndex(index))
    dispatch(setLevelIncreases(levels))
  }

  return (
    <PageStyle>
      {currentShip && (
        <div className='shipyard-card-upgrade goldman-font'>
          <div className='salvage-ship'>
            <div className='confirm-detail ship-attributes'>

              <div className='ship-info'>

                <span>Ship has {currentShip?.ship?.numCores} additional cores</span>
                <span>Allowable Max Upgrade: Lv. {maxRange}</span>
              </div>

              <div className='flex mt-2 progress-container'>
                <div className="w-1/2 pr-4">
                  <ShipAttributePlus title="Speed" value={currentShip?.ship?.stats[STAT_TYPES.SPEED]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Speed} onClick={() => handleClick(STAT_TYPES.SPEED, currentShip?.ship?.stats[STAT_TYPES.SPEED], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Speed?.max)} showMinusBtn={levelIncreases[STAT_TYPES.SPEED] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.SPEED)} upgrade={levelIncreases[STAT_TYPES.SPEED]} />

                  <ShipAttributePlus title="Attack" value={currentShip?.ship?.stats[STAT_TYPES.ATTACK]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Attack} onClick={() => handleClick(STAT_TYPES.ATTACK, currentShip?.ship?.stats[STAT_TYPES.ATTACK], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Attack?.max)} showMinusBtn={levelIncreases[STAT_TYPES.ATTACK] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.ATTACK)} upgrade={levelIncreases[STAT_TYPES.ATTACK]} />

                  <ShipAttributePlus title="Sp. Attack" value={currentShip?.ship?.stats[STAT_TYPES.SPECIAL_ATTACK]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.SpecialAttack} onClick={() => handleClick(STAT_TYPES.SPECIAL_ATTACK, currentShip?.ship?.stats[STAT_TYPES.SPECIAL_ATTACK], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.SpecialAttack?.max)} showMinusBtn={levelIncreases[STAT_TYPES.SPECIAL_ATTACK] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.SPECIAL_ATTACK)} upgrade={levelIncreases[STAT_TYPES.SPECIAL_ATTACK]} />

                  <ShipAttributePlus title="Mining" value={currentShip?.ship?.stats[STAT_TYPES.MINING]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Mining} onClick={() => handleClick(STAT_TYPES.MINING, currentShip?.ship?.stats[STAT_TYPES.MINING], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Mining?.max)} showMinusBtn={levelIncreases[STAT_TYPES.MINING] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.MINING)} upgrade={levelIncreases[STAT_TYPES.MINING]} />

                </div>
                <div className="w-1/2 pl-4 pr-4">

                  <ShipAttributePlus title="Luck" value={currentShip?.ship?.stats[STAT_TYPES.LUCK]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Luck} onClick={() => handleClick(STAT_TYPES.LUCK, currentShip?.ship?.stats[STAT_TYPES.LUCK], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Luck?.max)} showMinusBtn={levelIncreases[STAT_TYPES.LUCK] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.LUCK)} upgrade={levelIncreases[STAT_TYPES.LUCK]} />

                  <ShipAttributePlus title="Shields" value={currentShip?.ship?.stats[STAT_TYPES.SHIELDS]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Shields} onClick={() => handleClick(STAT_TYPES.SHIELDS, currentShip?.ship?.stats[STAT_TYPES.SHIELDS], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Shields?.max)} showMinusBtn={levelIncreases[STAT_TYPES.SHIELDS] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.SHIELDS)} upgrade={levelIncreases[STAT_TYPES.SHIELDS]} />

                  <ShipAttributePlus title="Sp. Defense" value={currentShip?.ship?.stats[STAT_TYPES.SPECIAL_DEFENSE]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.SpecialDefense} onClick={() => handleClick(STAT_TYPES.SPECIAL_DEFENSE, currentShip?.ship?.stats[STAT_TYPES.SPECIAL_DEFENSE], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.SpecialDefense?.max)} showMinusBtn={levelIncreases[STAT_TYPES.SPECIAL_DEFENSE] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.SPECIAL_DEFENSE)} upgrade={levelIncreases[STAT_TYPES.SPECIAL_DEFENSE]} />

                  <ShipAttributePlus title="Max Health" value={currentShip?.ship?.stats[STAT_TYPES.MAX_HEALTH]} range={SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Health} onClick={() => handleClick(STAT_TYPES.MAX_HEALTH, currentShip?.ship?.stats[STAT_TYPES.MAX_HEALTH], SHIP_TYPE_RANGE[currentShip?.ship?.shipType]?.Health?.max)} showMinusBtn={levelIncreases[STAT_TYPES.MAX_HEALTH] > 0 ? true : false} onClickMinus={() => handleClickMinus(STAT_TYPES.MAX_HEALTH)} upgrade={levelIncreases[STAT_TYPES.MAX_HEALTH]} />

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
    </PageStyle>
  )
}

export default UpgradeCard