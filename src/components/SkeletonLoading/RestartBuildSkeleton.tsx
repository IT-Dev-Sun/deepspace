import React from 'react';
import styled from 'styled-components'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ComponentStyle = styled.div`
    .restart-build-skeleton{
        border-radius: 12px;
        cursor: pointer;
        width: 260px;
        padding: 10px;
    }
`

export default function RestartBuildSkeleton() {
  return (
    <ComponentStyle>
      <SkeletonTheme baseColor="#06191c" highlightColor="#052125">
        <div className='restart-build-skeleton '>
          <div className='flex justify-between'>
            <Skeleton circle width={'50px'} height={'50px'} />
            <Skeleton width={'150px'} height={'50px'} />
          </div>
          <div className='flex justify-center mt-4'>
            <Skeleton width={'250px'} height={'200px'} />
          </div>
        </div>
      </SkeletonTheme>
    </ComponentStyle>
  )
}