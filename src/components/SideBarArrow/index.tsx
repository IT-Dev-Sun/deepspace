import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import { BsFillCaretRightFill } from 'react-icons/bs';
import { BsCaretLeftFill } from 'react-icons/bs'
interface SideBarArrowProps {
    status: boolean,
    handleClick: any
}
const SideBarArrowStyle = styled.div`
    .side-bar-left{
        top: 30px;
        right: -21px;
    }
    .side-bar-right{
        top: 30px;
        right: -9px;
    }

`;

const SideBarArrow: React.FC<SideBarArrowProps> = ({ status, handleClick }) => {
    return (
        <SideBarArrowStyle>
            <div className={cn('cursor-pointer absolute', {
                'side-bar-left': status === false,
                'side-bar-right': status === true,
            })} style={{ color: 'cyan' }}>
                {
                    status === true ? (
                        <BsCaretLeftFill size={'21px'} onClick={() => { handleClick(false) }} />
                    ) : (
                        <BsFillCaretRightFill size={'21px'} onClick={() => { handleClick(true) }} />
                    )
                }
            </div>
        </SideBarArrowStyle>
    )
}

export default SideBarArrow;