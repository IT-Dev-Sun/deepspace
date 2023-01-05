import React from 'react';
import styled from 'styled-components';

const InputStyle = styled.div`
.input-section{
    background-image:url(/images/playinput.png);
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

export default function SignUpInput({ type, onChange }) {
    const handleFocus = (e) => {
        e.parentNode.style.backgroundImage = `url(/images/playinput.png)`;
    }
    const handleBlur = (e) => {
        e.parentNode.style.backgroundImage = `url(/images/playinput.png)`;
    }
    return (
        <InputStyle>
            {
                type !== 'Input' && (
                    <div className="pt-4 pb-3 text-center">{type}</div>
                )
            }
            <div className="input-section">
                {
                    type === 'Email' && (
                        <input type='email' name={type} onChange={(e) => { onChange(e, type) }} onBlur={(e) => { handleBlur(e.target) }} onFocus={(e) => { handleFocus(e.target) }} required />
                    )
                }
                {
                    type !== 'Email' && type !== 'Input' && (
                        <input type='password' name={type} onChange={(e) => { onChange(e, type) }} onBlur={(e) => { handleBlur(e.target) }} onFocus={(e) => { handleFocus(e.target) }} />
                    )
                }
                {
                    type === 'Input' && (
                        <input type='text' autoComplete='off' maxLength={19} name={type} onChange={(e) => { onChange(e, type) }} onBlur={(e) => { handleBlur(e.target) }} onFocus={(e) => { handleFocus(e.target) }} />
                    )
                }

            </div>
        </InputStyle>
    )
}