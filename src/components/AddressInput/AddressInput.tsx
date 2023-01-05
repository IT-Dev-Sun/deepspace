import React from 'react'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import styled from 'styled-components';


const CurrencyNumberStyle = styled.div`
.input-section{
    background-image:url(/images/download-button.png);
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow: hidden;
}
.input-section input{
    background-color:transparent!important;
    padding:10px 18px;
    color:white;
    width:100%;
    min-width:260px;
}
`;

export default function AddressInput({ onChange, value }) {
  const handleFocus = (e) => {
    e.parentNode.style.backgroundImage = `url(/images/active-download-button.png)`;
  }
  const handleBlur = (e) => {
    e.parentNode.style.backgroundImage = `url(/images/download-button.png)`;
  }

  return (
    <CurrencyNumberStyle>
      <div className="input-section">
        <input type='text' onChange={(e) => { onChange(e) }} onBlur={(e) => { handleBlur(e.target) }} onFocus={(e) => { handleFocus(e.target) }} value={value} />
      </div>
    </CurrencyNumberStyle>
  )
}



