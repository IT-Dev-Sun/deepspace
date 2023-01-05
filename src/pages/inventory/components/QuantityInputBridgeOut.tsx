import React from 'react'
import styled from 'styled-components';

const InputStyle = styled.div`
  width: 190px;
  height: 30px;
  border: solid 2px #00AEEE;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  width: 130px;
  height: 20px;
  border: none;
  background: transparent;
  color: white;
`;

const MaxBtn = styled.button`
  border-radius: 3px;
  width: 40px;
  height: 20px;
  background: #00AEEE;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`
const QuantityInputBridgeOut = (props) => {
  return (
    <InputStyle>
      <Input type="text" placeholder="Quantity" onChange={props.onChange} value={props.bridgeOutDps} />
      <MaxBtn onClick={props.onClick}>Max</MaxBtn>
    </InputStyle>
  )
}

export default QuantityInputBridgeOut