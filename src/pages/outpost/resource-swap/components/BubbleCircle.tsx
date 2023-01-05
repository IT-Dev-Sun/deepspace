import React from 'react'
import styled from 'styled-components'

const BubbleCircle = ({ left }) => {
  const CircleWrapper = styled.div`
    // background: url('/images/resource/resource_swap_bg.png');
    // background-size: contain;
    @media(max-device-width:1030px) {
      & {
        display: none;
      }
    }
    @media(max-width:1030px) {
      & {
        display: none;
      }
    }
    width: 410px;
    height: 410px;
    position: absolute;
    top: calc( 50% - 206px);
    left: ${left};
    display: inline-block;

    &>span {
      z-index: 10;
    }
    &>nav {
      padding: 17px 15px 13px 15px;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: url('/images/resource/resource_swap_bg.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
    &>section {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      padding: 17px 15px 13px 15px;
      nav {
        width: 100%;
        height: 100%;
        background: #196a97;
        border-radius: 50%;
        opacity: 0.7;
      }
    }
    &>div {
      position: absolute;
      top: 0;
      z-index: 20;
      width: 100%;
      height: 100%;
      text-align: center;
      padding: 50px 0;
    }
    .bubble-container {
      display: flex;
      justify-content: center;   
    }
  `
  return (
    <CircleWrapper>
      {/* <Image src={bg} /> */}

      <nav>
      </nav>
      <section>
        <nav></nav>
      </section>
    </CircleWrapper>
  )
}

export default BubbleCircle