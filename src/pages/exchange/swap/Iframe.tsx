import React from 'react';
import styled from 'styled-components';

const CustomIframe = styled.iframe`
  width: 80%;
  max-width: 600px;
  height: 780px;
  @media(max-height:850px) {
    & {
      height: 650px;  
     }
  }
  @media(max-height:720px) {
    & {
      height: 550px;  
     }
  }
  @media(max-height:620px) {
    & {
      height: 450px;  
     }
  }
  @media(max-height:520px) {
    & {
      height: 350px;  
     }
  }
  @media(max-height:420px) {
    & {
      height: 250px;  
     }
  }
  @media(max-device-width:570px) {
    & {
      height: 780px;  
     }
  }
`
const Iframe = ({ source }) => {

  if (!source) {
    return <div>Loading...</div>;
  }

  const src = source;
  return (
    <div
      className="emdeb-responsive"
      style={{
        minHeight: 'calc(100vh - 75px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CustomIframe id='swap-iframe'
        src={src}
      >
      </CustomIframe>
    </div>
  );
};

export default Iframe;