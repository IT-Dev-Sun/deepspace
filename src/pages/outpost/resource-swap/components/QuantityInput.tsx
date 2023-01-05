import React from 'react'
import styled from 'styled-components';

const InputStyle = styled.div`
  @media(max-device-width:1030px) {
    & {
      height: 20px;
      width: 140px;
    }
  }
  @media(max-width:1030px) {
    & {
      height: 20px;
      width: 140px;
    }
  }
  height: 32px;
  border: solid 1px #00AEEE;
  position: relative;
  align-items: center;
`
const BackGround = styled.div`
  @media(max-device-width:1030px) {
    & {
      height: 18px;
    }
  }
  @media(max-width:1030px) {
    & {
      height: 18px;
    }
  }
  height: 30px;
  background: black;
  opacity: 0.6;
`

const InputContent = styled.div`
  @media(max-device-width:1030px) {
    & {
      height: 18px;
      width: 140px;
      .Title {
        font-size: 7px !important;
        margin-left: 7px;
      }
      input {
        font-size: 10px !important;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      height: 18px;
      width: 140px;
      .Title {
        font-size: 7px !important;
        margin-left: 7px;
      }
      input {
        font-size: 10px !important;
      }
    }
  }
  height: 30px;
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  jutify-content: space-around;
  align-items: center;
  input {
    text-align: center;
  }
  input::placeholder {
    color: #e3e4e5 !important;
  }
  .Title {
    color: #00A0DC;
    font-size: 10px;
  }
`

const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  width: 95px;
  height: 20px;
  font-size: 13px;
  border: none;
  background: transparent;
  color: white;
`;

const MaxBtn = styled.button`
  border-radius: 3px;
  width: 30px;
  height: 14px;
  margin-left: 10px;
  font-size: 10px;
  background: #00AEEE;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  @media(max-device-width:1030px) {
    & {
      margin-right: 0;
      margin-left: -8px;
      font-size: 8px;
      width: 20px;
      height: 11px;
    }
  }
  @media(max-width:1030px) {
    & {
      margin-right: 0;
      margin-left: -8px;
      font-size: 8px;
      width: 20px;
      height: 11px;
    }
  }
`

const QuantityInput = (props) => {
  return (
    <InputStyle>
      <BackGround></BackGround>
      <InputContent>
        <div className='Title'>Trade</div>
        {props.type === 'dps-resource' && (
          <Input type="text" placeholder="Quantity" onChange={(e) => props.onChange(e)}
            value={
              props.quantity &&
                props.quantity.split('.')[1] &&
                props.quantity.split('.')[1].length > 3 ?
                Number(props.quantity).toFixed(3)
                : props.quantity
            }
          />
        )}
        {props.type === 'resource-dps' && (
          <Input type="text" placeholder="Quantity" onChange={(e) => props.onChange(e)} value={props.quantity} />
        )}
        <MaxBtn onClick={props.onClick}>Max</MaxBtn>
      </InputContent>
    </InputStyle>
  )
}

export default QuantityInput