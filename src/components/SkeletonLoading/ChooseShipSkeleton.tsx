import React from 'react';
import styled from 'styled-components'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ComponentStyle = styled.div`
    .choose-ship-skeleton{
        width:100%;
        border-radius: 12px;
        cursor: pointer;
        padding:9px 12px;
        margin-bottom:21px;
    }
`

export default function ChooseShipSkeleton() {
  return (
    <ComponentStyle>
      <SkeletonTheme baseColor="#06191c" highlightColor="#052125">
        <div className='choose-ship-skeleton'>
          <p><Skeleton width={'240px'} height={'80px'} /></p>
          <p><Skeleton width={'240px'} height={'80px'} /></p>
          <p><Skeleton width={'240px'} height={'80px'} /></p>
          <p><Skeleton width={'240px'} height={'80px'} /></p>
          <p><Skeleton width={'240px'} height={'80px'} /></p>
          <p><Skeleton width={'240px'} height={'80px'} /></p>
        </div>
      </SkeletonTheme>
    </ComponentStyle>
  )
}