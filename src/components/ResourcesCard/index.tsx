import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import cn from 'classnames'
import { divide } from 'lodash'

import circle from '../../asset/image/circle.png'
import hydrogen from '../../asset/image/hydrogen.png'

interface ResourcesCardProps {
  id: number
  type: string
  unit: string
}

const StyledCard = styled.div`
  .unit-value {
    text-align: center;
    width: 38px;
    font-size: 12px;
  }

  .hydro-container {
    height: auto;
    border-radius: 2rem;
    border-color: #99ffff;
    background-color: rgb(0, 0, 0, 0.3);
  }
  .resource-card{
    width:220px;
  }
  .inv-btn{
    border:1px solid transparent;
    transition:.3s;
  }
  .inv-btn:hover{
    border:1px solid #99FFFF;
    color:#99FFFF;
  }
  
`

const ResourcesCard: React.FC<ResourcesCardProps> = ({ id, type, unit }) => {

  const ImageURL = `/images/${type}.png`;
  return (
    <StyledCard className="flex flex-wrap justify-center info-container pl-5 pr-5 mt-5">
      <div className="resource-card">
        <div className="hydro-container border-4 py-3 px-2 w-full">
          <div className="flex justify-center items-center flex-col pb-2">
            <div>
              <Image src={ImageURL} alt="flaskicon" width={'100px'} height={'100px'} className="mobile-image" />
            </div>
            <div className="text-center goldman-font mt-2" style={{ fontSize: '16px' }}>{type}</div>
          </div>
          <div className="flex justify-center items-center mb-6">
            <Image src={circle} alt="flaskicon" className="mobile-image" />
            <span className="absolute unit-value">{unit}</span>
          </div>
          <div className="flex flex-row justify-between mb-1">
            <button className="inv-btn py-1 mr-1 w-24 font-normal text-white text-sm bg-ds-purple-700 transition-all rounded-xl  xl:px-2 w-24 2xl:w-6/12">
              Transfer
            </button>
            <button className="inv-btn py-1 ml-1 w-24 font-normal text-sm text-white bg-ds-purple-700 transition-all rounded-xl xl:px-2 w-24 2xl:w-6/12">
              Sell
            </button>
          </div>
        </div>
      </div>
    </StyledCard>
  )
}

export default ResourcesCard
