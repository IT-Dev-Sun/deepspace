import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'

const PageStyle = styled.div`
  .shipyard-card-confirm {
    height: 400px;
    width: 260px;
    margin: 20px;
    position: relative;
  }
  .confirm-ship {
    background-color:rgba(0,0,0,0.5);
    text-align: center;
    border-radius: 10px;
    width: 260px;
  }
  .upgrade-resources-item {
    width: 60px;
    margin: 13px;
  }
  .upgrade-resources-item-txt {
    line-height: 0.25rem;
    font-size: 14px;
  }
  .luchy-charms {
    margin-top: 60px;
  }
  .luchy-charms-txt {
    font-size: 12px;
  }
  .confirm-btn {  
    display: flex;
    flex-direction: column;
    text-align: center;
    border:2px solid #3a2b54;
    margin-top: 10px;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    width: 240px;
    margin-left: 10px;
  }
  .confirm-build-title {
    color: #82eb6e;
  }
  .confirm-build-subtitle {
    color: #82eb6e;
    font-size: 12px;
  }
`

const upgrade_resources = [

  {
    type: '/images/iron.png',
    amount: 82
  },
  {
    type: '/images/fenna.png',
    amount: 82
  },
  {
    type: '/images/hydrogen.png',
    amount: 20
  },
  {
    type: '/images/netherite.png',
    amount: 5
  },
  {
    type: '/images/bedasine.png',
    amount: 20
  },
]

const ConfirmBuild = () => {
  return (
    <PageStyle>
      <div className='shipyard-card-confirm '>
        <div className='confirm-ship'>
          <span className='flex text-center'> Required Resources for Applied Upgrades </span>

          <div className='flex flex-wrap resource-item'>
            {
              upgrade_resources.map((item, index) => {
                return (
                  <div className='text-center upgrade-resources-item' key={index}>
                    <Image src={item.type} width={'100%'} height={'100%'} objectFit="contain" alt="Core type image" />
                    <div className='text-center upgrade-resources-item-txt'>{item.amount}</div>
                  </div>
                )
              })
            }
          </div>

          <div className='flex items-center justify-center luchy-charms'>
            <Image src={`/images/hydrogen.png`} width={40} height={40} alt="luchy Chrome image" />
            <span className='luchy-charms-txt'> Luchy Charms Required: 0</span>
          </div>
        </div>
        <div className='flex !flex-row items-center justify-center confirm-btn'>
          <div className='grid mr-2'>
            <span className='text-base font-bold confirm-build-title'>Confirm Build</span>
            <span className='confirm-build-subtitle'> Upgrade Ship </span>
          </div>
          <Image src={`/images/mint_1.png`} width={40} height={40} alt="confirm build img" />
        </div>
      </div>
    </PageStyle>
  )
}

export default ConfirmBuild