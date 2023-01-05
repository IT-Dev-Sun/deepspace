import React from 'react'
import styled from 'styled-components';

const TabStyle = styled.div`
margin-top: 40px;
position: relative;
justify-content: center;
display: flex;
`
const CustomTabs = styled.div`
  background: black;
  opacity: 0.2;
  height: 40px;
  width: 98%;
`
const SubtitleRight = styled.span`
  font-size: 13px;
  cursor: pointer;
  width: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  border-bottom: solid 2px #00AEEE;
  border-left: ${(props) => props.brigeOut ? 'solid 2px #00AEEE' : ''};
  border-top: ${(props) => props.brigeOut ? 'solid 2px #00AEEE' : ''};
  border-right: ${(props) => props.brigeOut ? 'solid 2px #00AEEE' : ''};
  background: ${(props) => props.brigeOut ? '#00AEEE' : ''};
`

const SubtitleLeft = styled.div`
  font-size: 13px;
  cursor: pointer;
  width: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  border-bottom: solid 2px #00AEEE;
  border-left: ${(props) => props.brigeInto ? 'solid 2px #00AEEE' : ''};
  border-top: ${(props) => props.brigeInto ? 'solid 2px #00AEEE' : ''};
  border-right: ${(props) => props.brigeInto ? 'solid 2px #00AEEE' : ''};
  background: ${(props) => props.brigeInto ? '#00AEEE' : ''};
`
const TabContainer = styled.div`
  position: absolute;
  height: 40px;
  display: flex;
  justify-content: space-around;
  width: 98%;
  top: 0px;
`


const BridgeTab = (props) => {

  return (
    <TabStyle>
      <CustomTabs></CustomTabs>
      <TabContainer>
        <SubtitleLeft onClick={props.bridgeIntoGame} brigeInto={props.brigeInto}>Bridge Into Game</SubtitleLeft>
        <SubtitleRight onClick={props.bridgeOutGame} brigeOut={props.brigeOut}>Bridge Out of Game</SubtitleRight>
      </TabContainer>
    </TabStyle>
  )
}

export default BridgeTab