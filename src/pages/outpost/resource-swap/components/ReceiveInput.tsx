import React from 'react'
import styled from 'styled-components';

const InputStyle = styled.div`
  @media(max-device-width:1030px) {
    & {
      height: 20px;
      width: 140px;
      input {
        font-size: 10px !important;
      }
      .Title {
        font-size: 7px !important;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      height: 20px;
      width: 140px;
      input {
        font-size: 10px !important;
      }
      .Title {
        font-size: 7px !important;
      }
    }
  }
  height: 32px;
  border: solid 1px #00AEEE;
  position: relative;
  align-items: center;
  .Title {
    color: #00A0DC;
    font-size: 10px;
  }
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
      input {
        width: 100px !important;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      height: 18px;
      input {
        width: 100px !important;
      }
    }
  }
  height: 30px;
  position: absolute;
  top: 0px;
  left: 5px;
  display: flex;
  jutify-content: space-around;
  align-items: center;
  input::placeholder {
    color: #e3e4e5 !important;
  }
`

const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  width: 130px;
  height: 20px;
  font-size: 13px;
  border: none;
  background: transparent;
  color: white;
`;


const ReceiveInput = (props) => {
  return (
    <InputStyle>
      <BackGround></BackGround>
      <InputContent>
        <div className='Title'>Receive</div>
        {props.type === 'dps-resource' && (
          <Input type="text" placeholder={props.placeholder} onChange={(e) => props.onChange(e)} value={props.quantity} />
        )}
        {props.type === 'resource-dps' && (
          <Input
            type="text"
            placeholder={props.placeholder}
            onChange={(e) => props.onChange(e)}
            value={
              props.quantity &&
                props.quantity.split('.')[1] &&
                props.quantity.split('.')[1].length > 3 ?
                Number(props.quantity).toFixed(3)
                : props.quantity
            }
          />
        )}
      </InputContent>
    </InputStyle>
  )
}

export default ReceiveInput