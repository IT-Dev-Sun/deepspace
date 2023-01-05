import React from 'react';
import styled from 'styled-components'
import { assetURL } from '../../functions/deepspace';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ComponentStyle = styled.div`
    width:260px;
    height:420px;
    .skeleton-card{
        border-radius: 24px;
        box-shadow: rgb(237 237 237) 0px 0px 5px 1px inset;
        border-color: rgb(237, 237, 237);
    }
    .stats-section{
        border-radius: 8px;
        border-bottom-left-radius: 18px;
        border-bottom-right-radius: 18px;
        border: 1px solid rgb(237, 237, 237);
    }
`

export default function SkeletonLoading() {
    return (
        <ComponentStyle style={{ backgroundImage: 'url(' + assetURL("ShipCardBack.svg") + ')' }} className="p-2 pt-3 pr-5">
            <SkeletonTheme baseColor="#1F022D" highlightColor="#650AAE">
                <div className='p-3 skeleton-card'>
                    <p className='flex items-center justify-between'>
                        <Skeleton width={'40px'} height={'20px'} />
                        <Skeleton circle={true} width={'28px'} height={'28px'} />
                    </p>
                    <p>
                        <Skeleton height={'150px'} />
                    </p>
                    <p className='flex justify-between'>
                        <Skeleton width={'100px'} height={'30px'} />
                        <Skeleton width={'100px'} height={'30px'} />
                    </p>
                    <div className="p-2 py-3 mt-3 stats-section">
                        <p>
                            <Skeleton height={'20px'} />
                            <Skeleton height={'20px'} />
                            <Skeleton height={'20px'} />
                            <Skeleton height={'20px'} />
                        </p>
                    </div>
                </div>
            </SkeletonTheme>
        </ComponentStyle>
    )
}