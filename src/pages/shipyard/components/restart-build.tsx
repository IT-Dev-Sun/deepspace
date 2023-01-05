import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import styled from 'styled-components'
import { getNFTImageURL, nftURL } from '../../../functions/deepspace';
import RestartBuildSkeleton from '../../../components/SkeletonLoading/RestartBuildSkeleton'
import { useSelector } from 'react-redux'
import HologramImage from '../../../asset/image/shipyard/hologram.png'
import { SHIP_CORE_TYPES } from '../../../constants/deepspace'
import AddCoreModal from '../../../components/Modal/AddCoreModal'
import { useActiveWeb3React } from '../../../hooks'
import { ToastContainer } from 'react-toastr';


const PageStyle = styled.div`
  .shipyard-card-restart {
    position: relative;
  }
  .restart-build {
    text-align: center;
  }

  .add-core-txt {
    font-size: 14px;
    text-align: left;
  }
  .add-core {
    font-size: 12px;
    cursor: pointer;
    padding: 5px;
    border: solid 1px #00aeef;
    background-color:#040604;
    z-index: 1000;
  }
  .ship-image {
    z-index: 999;
  }
  .hologram-img {
    width: 300px;
    position: absolute;
    bottom: auto;
    top: 293px;
    left: 32px;
  }
  .absolute.hologram-img img {
    @media (max-width: 768px) {
      top: -171px !important;
      left: -60px !important;
    }
    @media (max-width: 599px) {
      left: -40px !important;
    }

  }
  .detail-description {
    text-transform: uppercase;
    &>span {
      margin-bottom: 10px;
    }
    &>div {
      display: flex;
      justify-content: center;
    }
  }
  .imgPosition {
    margin-top: -30px;
    .absolute {
      top: 200px;
    }
  }

`

const RestartBuild = (props) => {

  let container;
  const [c, setC] = useState(null)
  const { account } = useActiveWeb3React()
  const { currentShip } = useSelector((state: any) => state.shipyard)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setC(container);
  }, [container])


  const addCores = () => {
    setShowModal(true)
  }

  const onClose = () => {
    setShowModal(false)
  }


  const showToastr = (status) => {
    if (c) {
      if (status === 'needCores') c.error("Available Cores are not enough", "Error");
      if (status === 'noSelectCores') c.error("Please select a valid number of cores.", "Error");
    }
  }

  return (
    <PageStyle>
      <div className='shipyard-card-restart'>
        <div className='relative restart-build'>
          {currentShip ? (
            <>
              <div className='flex flex-row justify-center restart-build-detail'>
                <div className=''>
                  <Image src={nftURL(`1/${currentShip?.ship?.coreType}/0.svg`)} width={40} height={40} alt="restart build image" />
                </div>
                <div className='flex flex-col ml-4 detail-description'>
                  <span className='add-core-txt'>Ship Name: {currentShip?.ship?.name}</span>
                  <span className='add-core-txt'>Ship Core: {SHIP_CORE_TYPES[currentShip?.ship?.coreType]}</span>
                  <div className='flex items-center'>
                    <span className='add-core-txt'>Ship’s Additional Cores: {currentShip?.ship?.numCores}/8</span>
                  </div>
                  {currentShip?.ship?.numCores !== 8 && (
                    <div className='mt-2 add-core' onClick={() => addCores()}>
                      Add Core(s)
                    </div>
                  )}
                </div>
              </div>
              <div className='imgPosition'>
                <Image src={getNFTImageURL(currentShip?.ship?.shipType, currentShip?.ship?.textureType, currentShip?.ship?.textureNum)} width={350} height={350} alt="restart build image" className='ship-image' />
                <div className='absolute'>
                  <Image src={HologramImage} alt="hologram-image" />
                </div>
              </div>
            </>
          ) : (
            <RestartBuildSkeleton />
          )}
        </div>
      </div>
      {account && (
        <AddCoreModal onClose={() => onClose()} show={showModal} showToastr={showToastr} />
      )}
      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
    </PageStyle>
  )
}

export default RestartBuild