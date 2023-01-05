import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  position: relative;
`
const InputNav = ({ children, width, height }) => {
  const Input = styled.div`
    @media(max-device-width:1030px) {
      & {
        height: ${height === '35px' ? height : '20px'};
        width: ${width === '160px' ? '120px' : '140px'};
      }
    }
    @media(max-width:1030px) {
      & {
        height: ${height === '35px' ? '30px' : '20px'};
        width: ${width === '160px' ? '110px' : '140px'};
      }
    }
    width: ${width};
    height: ${height};
    display: inline-block;
    outline: 1px solid #059bd5;
    // box-shadow: 0 0 2px 2px gainsboro;
    position: relative;
    div {
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0.6;
    }
    nav {
      position: absolute;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      width: 100%;
      height: 100%;
      font-size: 13px;

      .fixPositionFirst {
        position: absolute;
        left: 5px;
        font-size: 9px;
        color: #00A0DC;
      }
      .middlePosition {
        display: flex;
        margin-left: 6px;
      }
    }
  `
  return (
    <Div>
      <Input>
        <div></div>
        <nav>{children}</nav>
      </Input>
    </Div>

  )
}

export default InputNav