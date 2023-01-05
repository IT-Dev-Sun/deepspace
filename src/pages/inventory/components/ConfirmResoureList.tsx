import React from 'react'
import styled from 'styled-components';
import Image from 'next/image';

const Wrapper = styled.div`
  width: 100%;
  height: ${(props) => props.type === 'confirm' ? '50px' : '60px'};
  border: solid 2px #00AEEE;
  position: relative;           
`
const BackGround = styled.div`
  width: 100%;
  height: ${(props) => props.type === 'confirm' ? '46px' : '56px'};
  background: black;
  opacity: 0.3;    
`
const List = styled.div`
  width: 100%;
  height: ${(props) => props.type === 'confirm' ? '47px' : '57px'};
  position: absolute;
  display: flex;
  align-items: center;
  top: 0px;
`
const ResourceItem = styled.div`
  position: relative;
  width: ${(props) => props.type === 'confirm' ? '35px' : '40px'};
  height: ${(props) => props.type === 'confirm' ? '35px' : '40px'};
  border: solid 1px #00AEEE;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 5px;
`
const Quantity = styled.span`
  position: absolute;
  right: 4px;
  bottom: -3px;
  font-family: monospace;
`

const ConfirmResoureList = (props) => {
  return (
    <Wrapper type={props.type}>
      <BackGround type={props.type}></BackGround>
      <List type={props.type}>
        {props.confirmResources && props.confirmResources.map((item, index) => {
          return (
            <ResourceItem type={props.type} key={index}>
              <Image src={item.img} width={25} height={25} />
              <Quantity>{item?.quantity}</Quantity>
            </ResourceItem>
          )
        })}
      </List>
    </Wrapper>
  )
}

export default ConfirmResoureList