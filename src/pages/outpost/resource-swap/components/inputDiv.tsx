import React from 'react'
import styled from 'styled-components'

const Input = styled.div`
  @media(max-device-width:1030px) {
    & {
      height: 20px;
      width: 140px;
      nav {
        font-size: 10px !important;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      height: 20px;
      width: 140px;
      nav {
        font-size: 10px !important;
      }
    }
  }
  width: 185px;
  height: 28px;
  display: inline-block;
  outline: 1px solid #059bd5;
  position: relative;
  div {
    width: 100%;
    height: 100%;
    background: #00b1ed;
    opacity: 0.2;
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
    font-size: 16px;
  }
`
const Div = styled.div`
  position: relative;
  section {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top: 0;
    border-bottom: 10px solid #00afee;
    position: absolute;
    transform: rotate(180deg);
    left: calc( 50% - 4px);
    top: -5px;
  }
  @media(max-device-width:1030px) {
    &>section {
      left: calc( 50% - 26px);
    }
  }
  @media(max-width:1030px) {
    &>section {
      left: calc( 50% - 26px);
    }
`
const InputDiv = ({ value }) => {
  return (
    <Div>
      <Input>
        <div></div>
        <nav>{value}</nav>
      </Input>
      <section></section>
    </Div>

  )
}

export default InputDiv