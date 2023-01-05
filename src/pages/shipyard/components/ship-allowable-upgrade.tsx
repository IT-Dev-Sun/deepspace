import React, { useState } from 'react'
import styled from 'styled-components'
import UpgradeCard from './upgrade-card'
import { IoHelpCircleSharp } from 'react-icons/io5'
import HelperShipyardModal from '../../../components/Modal/HelperShipyardModal'

const PageStyle = styled.div`
  @media(max-device-width:820px) {
    .container {
      width: 368px !important;
      .bottom_border + div {
        display: none !important;
      }
    }
    .bottom-container {
      position: relative;
      padding: 0 !important;
      margin-top: 10px;
      margin-bottom: 20px;
      .ship-tool-item-container .dv-star-rating {
        display: none !important;
      }
    }
  }
  .container {
    position: relative;
    height: 248px;

    .range-input {
      width: 82px !important;
    }

    .flex.mt-4.progress-container {
      margin-top: 17px !important;
    }

    .relative.flex.justify-between.mt-2.value-container {
      margin-top: 2px;
    }
    .fxEyAh .progress-value {
      height: 11px !important;
    }
    .fxEyAh .progress-bg {
      height: 11px !important;
    }
  }

  .content_holder {
    background-image:url(../images/shipyard/shipyard-layout.png);
    background-size: 100% 100%;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding-left: 5%;
    padding-right: 10%;
  }
  .title {
    font-size: 15px;
    margin: 7px 0px 0px;
    padding: 5px 0px;
    border-bottom: 2.5px solid #006f98;
  }
  .question_icon{
    position: absolute;
    width: fit-content;
    height: fit-content;
    right: 10px;
    bottom: 0;
    font-size: 25px;
    cursor: pointer;
  }
  .question_icon:hover {
    svg {
      fill: #d100a4;
      transition: fill 0.5s;
    }
  }
  .bottom-container {
    position: relative;
    height: 100px;
    padding: 15px 20px 0px 7px;
  }
  .ship-tool-item {
    width: 50px;
    height: 50px;
    border: solid 1px #00aeef;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .text-center.ship-tool-item-container {
    label {
      color: #F9FF00 !important;
      i {
        font-size: 28px;
        line-height: 0.8;
      }
    }
  }
  .absolute.bottom-0.right-0.text-xs {
    position: absolute;
    left: 3px;
    bottom: 1px;
    text-align: left;
  }
  .title {
    font-size: 14px;
  }
  .coming-soon {
    position: absolute;
    margin-top: 12px;
    left: 120px;
    z-index: 1;
  }
`

const ShipAllowableUpgrade = (props) => {

  const [shipAllowUpgrade, setShipAllowUpgrade] = useState(false)


  return (
    <PageStyle>

      <div className={"container goldman-font"}>

        <div className={"question_icon"}>
          <IoHelpCircleSharp className='question-helper' onClick={() => setShipAllowUpgrade(true)} />
        </div>

        <div className={"content_holder"}>
          <div className={"title"}>
            <h3>SHIP ALLOWABLE UPGRADES</h3>
          </div>
          <UpgradeCard />
        </div>

      </div>

      <div className='bottom-container'>
        <div className='text-center goldman-font coming-soon'>Coming soon...</div>
        <div className='flex justify-between ship-tool'>

          <div className='text-center ship-tool-item-container'>
            <div className='relative ship-tool-item'>
            </div>

          </div>

          <div className='text-center ship-tool-item-container'>
            <div className='relative ship-tool-item'>
            </div>

          </div>

          <div className='relative ship-tool-item'>
          </div>

          <div className='relative ship-tool-item'>
          </div>

          <div className='relative ship-tool-item'>
          </div>

        </div>

      </div>
      {shipAllowUpgrade && (
        <HelperShipyardModal show={shipAllowUpgrade} type="ship-allowable-upgrades" onClose={() => setShipAllowUpgrade(false)} />
      )}
    </PageStyle>
  )
}

export default ShipAllowableUpgrade