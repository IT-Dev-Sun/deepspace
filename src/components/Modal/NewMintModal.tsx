import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import ShipCard from '../ShipCard'
import cn from 'classnames'
import { useAddShipCard, useShipCard, useMultiShips } from '../../state/others/hooks';
import config from '../../config'
import { AiFillCloseCircle } from 'react-icons/ai'
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { detectBrowser } from '../../functions/deepspace'

const StyledCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  
  .body {
    justify-content: center;
    width: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color:white;
  }
  .browser-1{
    background-image:url(../images/modal.png);
  }
  .browser-2{
    background-image:url(../images/modal_1.png);
  }
  .mobile-body-1{
    background-image:url(../images/sign_card.png);
  }
  .mobile-body-2{
    background-image:url(../images/sign_card_1.png);
  }
  .body .card-container{
      padding-right:2px!important;
  }
  .left-direction,.right-direction{
    top:50%;
  }
  .left-direction{
      left:0px;
      top:50%;
      transform:translate(-0%,-50%);
      font-size:21px;
      cursor:pointer;
  }
  .right-direction{
      top:50%;
      right:0px;
      transform:translate(0%,-50%);
      font-size:21px;
      cursor:pointer;
  }
  .ship-number{
    left:50%;
    bottom:-6px;
    font-size:18px;
    transform:translate(-50%,0%)
  }

  @media(max-width:640px){
    .ship-number{
        bottom:-18px;
    }
  }
`
export interface NewMintModalProps {
    show: boolean,
    onClose: () => void,
    handleClick: (parms) => void
}
export default function NewMintModal({ show, onClose, handleClick }: NewMintModalProps) {
    const shipCard = useShipCard();
    const multiShips = useMultiShips();
    const addShipCard = useAddShipCard();

    const [isBrowser, setIsBrowser] = useState(false);
    const [dirValue, setDirValue] = useState(0);
    const [shipcard, setShipCard] = useState(null);
    const browserType = detectBrowser();
    useEffect(() => {
        if (multiShips && multiShips.length) {
            addShipCard(multiShips[dirValue]);
        }
    }, [dirValue, multiShips]);
    useEffect(() => {
        setIsBrowser(true);
        if (multiShips && multiShips.length) addShipCard(multiShips[dirValue]);
    }, [])
    const closeModal = () => {
        onClose();
    }
    useEffect(() => {

    }, [])
    const handleDirection = (dir) => {
        let len = multiShips.length;
        let d = dirValue + dir;
        d = (d + len) % len;
        setDirValue(d);
    }
    const modalContent = show ? (
        <StyledCard className="z-50 Modal">
            <div className={cn('relative items-center p-5 mx-2 text-black sm:flex body', {
                'browser-1': browserType !== 'Firefox',
                'browser-2': browserType === 'Firefox',
                "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
                "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
            })}>
                <div className="absolute cursor-pointer right-5 top-5">
                    <AiFillCloseCircle style={{ fontSize: '18px' }} onClick={() => { onClose() }} />
                </div>
                <div className="relative px-3 mt-3">
                    {
                        multiShips && multiShips.length > 1 && (
                            <>
                                <MdKeyboardArrowLeft className='absolute left-direction' onClick={() => { handleDirection(-1) }} />
                                <MdKeyboardArrowRight className='absolute right-direction' onClick={() => { handleDirection(1) }} />
                                <div className='absolute ship-number'>{dirValue + 1} / {multiShips.length}</div>
                            </>
                        )
                    }
                    {
                        shipCard && (<ShipCard
                            nftData={shipCard}
                            price={'0'}
                            nftFullData={shipCard}
                        />)
                    }


                </div>
                <div className="flex items-center justify-center px-3">
                    <div>
                        <div className="" style={{ color: "#00ffff" }}>
                            <div className='mt-3 text-2xl font-bold text-center goldman-font'>Congratulations!</div>
                            <div className="mt-5" style={{ fontSize: '14px', color: '#fff' }}>
                                <div>
                                    You have minted this ship.
                                </div>
                                {
                                    config.BUTTONS.filter((button) => { return button === 'Lock' }).length ? (
                                        <div className="mt-2">
                                            You can select <b style={{ color: '#00ffff' }}>Lock</b> to bridge your ship <br />into the game, or <b style={{ color: '#00ffff' }}>List</b> to add a <br />listing to the Outpost marketplace.
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            You can select <b style={{ color: '#00ffff' }}>List</b> to add a <br />listing to the Outpost marketplace.
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                        <div>
                            <div className={cn("flex  mt-5 mb-3", {
                                "justify-between": config.BUTTONS.filter((button) => { return button === 'Lock' }).length > 0,
                                "justify-center": config.BUTTONS.filter((button) => { return button === 'Lock' }).length === 0
                            })}>
                                {
                                    config.BUTTONS.filter((button) => { return button === 'Lock' }).length ? (

                                        <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleClick('bridge-ship-in') }}>
                                            <span className="glass-button-before"></span>
                                            <span>Lock</span>
                                        </button>
                                    ) : (
                                        ''
                                    )
                                }
                                <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleClick('list-ship') }}>
                                    <span className="glass-button-before"></span>
                                    <span>List</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledCard >
    ) : null
    if (!isBrowser) {
        return null
    } else {
        return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'))
    }
}
