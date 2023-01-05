import React from 'react';
import styled from 'styled-components';
import DetailImage from '../../asset/image/details.svg'
import Image from 'next/image';
const StakingPatternElementStyle = styled.div`
    height:39px;
    div{

        background-color:#58079A;
        color:white;
        border-radius:12px;
        overflow:hidden;
        padding:0px 15px;
        margin:0px;
        line-height: 1.3;
        
    }
    @media(max-width:380px){
        .staking-pattern {
            font-size:12px!important;
        }
        height:27px;
    }
    @media(max-width:310px){
        .staking-pattern {
            font-size:9px!important;
        }
        height:24px;
    }
`
interface StakingPatternElementProps {
    content: string | number
    handleClick?: any
    type?: string
    className?: string
}
const StakingPatternElement: React.FC<StakingPatternElementProps> = ({ content, className }) => {
    return (
        <StakingPatternElementStyle className="text-md lg:text-lg flex px-1 justify-center items-center" >
            {
                <div className="inline-block staking-pattern"><span className={`${className}`}>{content}</span></div>
            }
        </StakingPatternElementStyle>
    );

}
export default StakingPatternElement;