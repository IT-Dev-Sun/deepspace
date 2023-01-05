import React, { useState } from 'react'
import styled from 'styled-components'
import AllIcon from '../../../asset/image/shipyard/all.svg'
import Core from '../../../asset/image/shipyard/core.svg'
import Jewel from '../../../asset/image/shipyard/jewel.svg'
import Upgrade from '../../../asset/image/shipyard/upgrade.svg'
import Image from 'next/image';

const PageStyle = styled.div`
.tab_holder_child{
  position: relative;
  height: 135px;
  width: 40.5px;
  padding: 5px 0px;
  overflow: hidden;
}
.sub_tab_holder_child{
  position: relative;
  height: 125px;
  width: 35px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(320deg, transparent 28px, rgba(3, 58, 78, 0.85) 0) bottom left, linear-gradient(215deg, transparent 28px, rgba(3, 58, 78, 0.85) 0) top right;
  background-size: 100% 50%;
  background-repeat: no-repeat;
  & img {
    filter: invert(1);
  }
}
.top_border_child{
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 22px;
  margin-left: -8px;
  width: calc(100% + 18px);
  border-top: 2px solid #00aeef;
  transform: rotate(35deg);
}
.right_border_child{
  position: absolute;
  top: -6px;
  right: 0;
  margin-top: 41px;
  height: calc(100% - 69px);
  border-right: 2px solid #00aeef;
}

.right_sub_border{
  position: absolute;
  top: -5px;
  right: 0;
  margin-top: 39px;
  height: calc(100% - 68px);
  border-right: 2px solid #00aeef;
}
.bottom_border_child{
  position: absolute;
  bottom: 0;
  left: 0;
  margin-bottom: 22px;
  margin-left: -8px;
  width: calc(100% + 18px);
  border-bottom: 2px solid #00aeef;
  transform: rotate(325deg);
}
.left_border_child{
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 5px;
  margin-right: -2px;
  height: calc(100% - 10px);
  border-left: 2px solid #00aeef;
}
.icon-holder{
  padding: 0px 2px;
  display: flex;
  justify-content: center;
  align-item: center;
}
`

const Tab = ({ data, activeTab }) => {

  const renderSwitchIcon = () => {
    switch (data.id) {
      case 1:
        return (<Image src={AllIcon} width={50} height={50} alt="all-image" />)
      case 2:
        return (<Image src={Core} width={50} height={50} alt="Core-image" />)
      case 3:
        return (<Image src={Upgrade} width={50} height={50} alt="Upgrade-image" />)
      case 4:
        return (<Image src={Jewel} width={50} height={50} alt="Jewel-image" />)
      default:
        return <Image src={AllIcon} width={50} height={50} alt="all-image" />
    }
  }

  return (
    <PageStyle>
      <div className="tab_holder_child">
        <div className="top_border_child"></div>
        <div className="right_border_child"></div>
        <div className="bottom_border_child"></div>
        <div
          className="sub_tab_holder_child"
          style={
            data.active
              ? {
                background: `linear-gradient(325deg, transparent 28px, #00aeef 0) bottom left, linear-gradient(215deg, transparent 28px, #00aeef 0) top right`,
                backgroundSize: "100% 50%",
                backgroundRepeat: "no-repeat",
              }
              : {}
          }
          onClick={() => activeTab(state => state.map(tab => ({ ...tab, active: tab.id === data.id || false })))}
        >

          <div className="icon-holder">
            {renderSwitchIcon()}
          </div>

          <div className="top_border_child"></div>
          <div className="right_sub_border"></div>
          <div className="bottom_border_child"></div>
          <div className="left_border_child"></div>
        </div>
      </div>
    </PageStyle>
  )
}

export default Tab