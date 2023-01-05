import React from 'react'
import Image from 'next/image';
import styled from 'styled-components'
import layout from '../../../asset/image/resource-swp/layout.png'
import mobileBg from '../../../asset/image/resource-swp/glactic_mobile_bg.png'
import swapBtn from '../../../asset/image/resource-swp/swab_btn.png'
import DpsToResource from './DpsToResource'
import ResourceToDps from './ResourceToDps';
import OutPostMobileFooter from '../Footer'
import Default from "../../../layouts/Default";

const StyleWraper = styled.div`
  @media(max-device-width:1030px) {
    & {
      padding-bottom: 130px;
      .style_title {
        font-size: 10px !important;
        left: calc(50% - 92px) !important;
        top: 3px !important;
        color: white !important;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      padding-bottom: 130px;
      .style_title {
        font-size: 10px !important;
        left: calc(50% - 92px) !important;
        top: 3px !important;
        color: white !important;
      }
    }
  }
  color: #e3e4e5 !important;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .arrow {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 2px;
    position: absolute;
    top: calc(50% - 4px);
  }
  .down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  .up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
  }
  .fixPositionMax {
    background: #0187ba;
    position: absolute;
    right: 7px;
    font-size: 9px;
    padding: 1px 5px 0px 5px;
    border-radius: 5px;
  }
  & > section {
    height: 596px;
    width: 1369px;
    position: relative;
    
    @media(max-device-width:1030px) {
      width: 325px;
      height: 740px;
    }
    @media(max-width:1030px) {
      width: 325px;
      height: 740px;
    }
  }
  .arrowIcon {
    background: #0187ba;
    padding: 1px 5px 0px 5px;
    width: 11px;
    height: 12px;
    position: absolute;
    right: 7px;
    border-radius: 3px;
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .style_title {
    font-size: 24px;
    left: calc(50% - 220px);
    position: absolute;
    top: 19px;
  }
  .style_subtitle {
    width: 350px;
    font-size: 25px;
    position: absolute;
    top: -32px;
    left: calc(50% - 180px);
  }
  .style_subtitle_dps {
    width: 350px;
    font-size: 25px;
    position: absolute;
    top: -32px;
    left: calc(50% - 163px);
  }
  .dropdown {
    position: relative;
    display: inline-block;

    .dropdown-content {
      position: absolute;
      background-color: #f1f1f1;
      min-width: 185px;
      overflow: auto;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
      top: 30px;
      background: transparent;
      outline: 1px solid #059bd5;
      font-size: 12px;
    }

    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    #myDropdown {
      padding: 10px 10px;
      section {
        height: 100px;
        overflow: auto;
        position: relative;
        z-index: 10;
        .list {
          display: flex;
          align-items: center;
          cursor: pointer;
          span:last-child {
            margin-left: 10px;
          }
        }
      }
    }
    #myDropdown > nav {
      position: absolute;
      height: 120px;
      width: 190px;
      left: -5px;
      top: 0px;
      background: black;
      opacity: 0.9;
      z-index: 5;
    }
    #myDropdown .section::-webkit-scrollbar {
      width: 3px;
    }
    #myDropdown .section::-webkit-scrollbar-thumb {
      background: #00aeef;
    }
    #myDropdown .section::-webkit-scrollbar-thumb:hover {
      background: #006f98;
    }
    #myDropdown .section::-webkit-scrollbar-button:single-button {
      background: #00aeef;
      height: 2px;
    }
    #myDropdown .section::-webkit-scrollbar-button:single-button:active {
      background: #006f98;
    }
  }
  .dropdownSwap {
    position: relative;
    display: inline-block;

    .dropdown-content {
      position: absolute;
      background-color: #f1f1f1;
      min-width: 360px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
      top: 36px;
      background: transparent;
      outline: 1px solid #059bd5;
      font-size: 12px;
      left: calc(-50% - 55px);
    }

    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    #myDropdown {
      padding: 10px 10px;
      top: 66px;
      background: #154d6d;
      outline: 3px solid #059bd5;
      section {
        position: relative;
        z-index: 10;
        .list {
          outline: 3px solid #059bd5;
          width: 50px;
          height: 50px;
          display: inline-block;
          margin: 15px;
          background: #05384b;

          span.subNumber {
            position: relative;
            top: -23px;
            left: 16px;
          }
        }
      }
      .triangle {
        padding: 3px;
        padding-bottom: 0;
        position: absolute;
        top: -30px;
        left: calc(50% - 7px);
        width: 22px;
        height: 30px;
        background-image: linear-gradient(to bottom right, transparent 50%, #059bd5 0),
          linear-gradient(to top right, #059bd5 50%, transparent 0);
        background-size: 50% 100%;
        background-repeat: no-repeat;
        background-position: left, right;

        .subTriangle {
          width: 16px;
          height: 32px;
          background-image: linear-gradient(to bottom right, transparent 50%, #154d6d 0),
            linear-gradient(to top right, #154d6d 50%, transparent 0);
          background-size: 50% 77%;
          background-repeat: no-repeat;
          background-position: left, right;
        }
      }
    }
    #myDropdown > nav {
      position: absolute;
      height: 192px;
      width: 345px;
      top: 0px;
      left: 0;
      background: black;
      opacity: 0.9;
      z-index: 5;
    }
  }
`

const DivBackground = styled.div`
  background: black;
  opacity: 0.55;
  border-radius: 44px;
  box-shadow: 0 0 6px 2px black;
  width: calc(100% - 5px);
  height: 100%;
  position: absolute;
  top: 0;

  @media(max-device-width:900px) {
    & {
      display: none;
    }
  }
`

const SwapBtnImage = styled.div`
  position: absolute;
  top: calc(50% - 73px);
  left: calc(50% - 78px);
  cursor: pointer;
  @media(max-width:1030px) {
    & {
      display: none;
    }
  }
  @media(max-device-width:1030px) {
    & {
      display: none;
    }
  }
`

const ComImage = styled.div`
  & {
    @media(max-device-width:1030px) {
      display: none;
    }
  }
  & {
    @media(max-width:1030px) {
      display: none;
    }
  }
`

const MobileImage = styled.div`
  display: none;
  width: 325px;
  height: 740px;
  @media(max-device-width:1030px) {
    & {
      display: block;
    }
  }
  @media(max-width:1030px) {
    & {
      display: block;
    }
  }
`
const ResourceSwap = () => {

  return (
    <>
      <StyleWraper className='goldman-font'>
        <section>
          <DivBackground />
          <ComImage>
            <Image src={layout} />
          </ComImage>
          <MobileImage>
            <Image src={mobileBg} />
          </MobileImage>
          <div className='style_title'>
            GALACTIC RESOURCE EXCHANGE
          </div>

          <div className="dps-resource">
            <DpsToResource />
          </div>

          <SwapBtnImage>
            <Image src={swapBtn} />
          </SwapBtnImage>

          <div className='resource-dps'>
            <ResourceToDps />
          </div>
        </section>
      </StyleWraper>
      <OutPostMobileFooter />
    </>

  )
}

export default ResourceSwap

ResourceSwap.Layout = Default