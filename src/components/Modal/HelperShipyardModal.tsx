import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import '@babylonjs/loaders/glTF';
import config from '../../config';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import { StakingHeader } from '../StakingHeader';
import { AiFillCloseCircle } from 'react-icons/ai'

const StyledCard = styled.div`
 z-index: 1002;
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
    color:white;
    overflow:auto;
    max-width:960px;
    background-color:#202231;
  }
  .helper-table table{
      width:48%;
      font-size:14px;
  }
  .helper-content{
      max-height:calc( 100vh - 250px );
      overflow:auto;
  }
  .helper-content::-webkit-scrollbar {
    width: 9px;
    }
    .helper-content::-webkit-scrollbar-track {
        background-color:transparent;
        border-radius:6px;
        border:1px solid gray;
        overflow:hidden;
    }
    .helper-content::-webkit-scrollbar-thumb {
        background-color:#0A1014;
        border-radius:6px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
  .helper-table table,tr,td,th{
    border:1px solid gray;
    border-collapse:collapse;
    padding:6px 12px;
  }
  .warning-message{
      font-size:14px;
  }
  @media(max-width:576px){
    .helper-table table{
        width:100%;
        font-size:12px;
    }
    .helper-content{
        font-size:13px;
    }
  }
  @media(max-width:500px){
    .staking-table table{
        min-width:initial;
    }
  }

`
export interface ComponentProps {
  type: any
  show: boolean
  onClose?: () => void
}
export default function HelperShipyardModal({ show, onClose, type }) {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, [])
  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div>
        <div className='relative flex p-3 mx-3 body w-90 py-7 sm:p-7 sm:py-10' style={{ width: 350 }}>
          <div>
            <div className="absolute top-3 right-3 close-button">

              <AiFillCloseCircle onClick={(e) => { onClose() }} style={{ cursor: 'pointer', color: 'white', fontSize: "21px" }} />
            </div>

            {type === 'ship-allowable-upgrades' && (
              <StakingHeader className={'text-sm font-bold md:text-2xl text-center'} content={'Ship Upgrades'} />
            )}
            {type === 'required-resouce-helper' && (
              <StakingHeader className={'text-sm font-bold md:text-2xl text-center'} content={'Resources Required'} />
            )}
            {type === 'tab-helper' && (
              <StakingHeader className={'text-sm font-bold md:text-2xl text-center'} content={'Available Inventory'} />
            )}

            <hr className='mx-3 mt-3 mb-3' style={{ borderColor: 'gray' }} />
            <div className="helper-content">
              <div className='mx-3'>
                {type === 'ship-allowable-upgrades' && (
                  <div>
                    <p > Select which stats you'd like to upgrade on your ship.</p>
                    <p>The resources required will update dynamically in the resources required area below.</p>
                    <br />
                    <p className='mb-4'><b>NOTE:</b> To be able to select values above 50 you'll need the correct amount of additional ship cores added to your ship. You'll not be able to upgrade an individual stat beyond it's ship class maximum.</p>
                  </div>
                )}

                {type === 'required-resouce-helper' && (
                  <div>
                    <p > Displays the amount of resources needed to achieve the upgrades you have selected in the ship allowable upgrade area above. </p>

                  </div>
                )}

                {type === 'tab-helper' && (
                  <div>
                    <p > Displays what you have available in your inventory. </p>
                    <p > Click the tabs on the left to filter to available resources, ship cores, equipment items, and gems. </p>
                  </div>
                )}
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
