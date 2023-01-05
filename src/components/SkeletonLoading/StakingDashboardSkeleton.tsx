import React from 'react';
import styled from 'styled-components'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ComponentStyle = styled.div`
    .staking-dashboard-skeleton{
        width:100%;
        border: 2px dotted #DC00A5;
        border-radius: 12px;
        cursor: pointer;
        padding:9px 12px;
        margin-bottom:21px;
    }
`

export default function StakingDashboardSkeleton() {
    return (
        <ComponentStyle>
            <SkeletonTheme baseColor="#1F022D" highlightColor="#650AAE">
                <div className='flex justify-between staking-dashboard-skeleton'>
                    <div>
                        <Skeleton circle width={'100px'} height={'100px'} />
                    </div>
                    <div>
                        <p><Skeleton width={'260px'} height={'20px'} /></p>
                        <p><Skeleton width={'260px'} height={'20px'} /></p>
                        <p><Skeleton width={'260px'} height={'20px'} /></p>
                        <p><Skeleton width={'260px'} height={'20px'} /></p>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div>
                            <p><Skeleton width={'100px'} height={'30px'} /></p>
                            <p><Skeleton width={'100px'} height={'30px'} /></p>
                        </div>
                    </div>
                    <div>
                        <Skeleton circle width={'100px'} height={'100px'} />
                    </div>
                </div>
            </SkeletonTheme>
        </ComponentStyle>
    )
}