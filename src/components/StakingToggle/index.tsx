import React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
const StakingToggleStyle = styled.div`
    .deactive-button, .active-button{
        transition:.5s;
        padding:6px 18px;
    }
    .toggle-button{
        background-color:transparent;
        transition:.5s;
        padding:6px 18px;
        color:white;
    }
    .toggle-button:hover{
        background-color:#DC00A5;
        color:white;
    }
    .active-button{
        color:white;
        background-color:#DC00A5;
    }
    .active-button:hover{
        background-color:#DC00A5;
        color:white;
    }
    
`
export function StakingToggle({ status, handleClick }) {
    return (
        <StakingToggleStyle className="mx-2">
            <button type='button' onClick={() => { handleClick(false) }} className={cn("cursor-pointer font-bold text-md lg:text-xl toggle-button mr-3", {
                'active-button': status === false
            })}>Unstaked</button>
            <button type='button' onClick={() => { handleClick(true) }} className={cn("cursor-pointer font-bold text-md lg:text-xl toggle-button", {
                'active-button': status === true
            })}>Staked</button>
        </StakingToggleStyle>
    )
}