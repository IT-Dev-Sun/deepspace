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
const defaultMaskOptions = {
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: 16, // limit length of integer numbers
    allowNegative: false,
    allowLeadingZeroes: false,
}
interface CurrencyNumberProps {
    maskOptions?: any,
    onChange: any
    val: any
}

export default function CurrencyNumber({ maskOptions, onChange }: CurrencyNumberProps) {
    const handleFocus = (e) => {
        e.parentNode.style.backgroundImage = `url(/images/active-download-button.png)`;
    }
    const handleBlur = (e) => {
        e.parentNode.style.backgroundImage = `url(/images/download-button.png)`;
    }
    const currencyMask = createNumberMask({
        ...defaultMaskOptions,
        ...maskOptions,
    })

    return (
        <CurrencyNumberStyle>
            <div className="input-section">
                <MaskedInput mask={currencyMask} type='text' onChange={(e) => { onChange(e) }} onBlur={(e) => { handleBlur(e.target) }} onFocus={(e) => { handleFocus(e.target) }} />
            </div>
        </CurrencyNumberStyle>
    )
}



