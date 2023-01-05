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
    show: boolean
    onClose: () => void
}
export default function StakingModal({ show, onClose }) {
    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => {
        setIsBrowser(true);
    }, [])
    const modalContent = show ? (
        <StyledCard className="z-50 Modal">
            <div>

                <div className='relative flex p-3 mx-3 body w-90 py-7 sm:p-7 sm:py-10'>
                    <div>
                        <div className="absolute top-3 right-3 close-button">
                            <AiFillCloseCircle onClick={(e) => { onClose() }} style={{ cursor: 'pointer', color: 'white', fontSize: "21px" }} />
                        </div>
                        <StakingHeader className={'text-sm font-bold md:text-2xl text-center'} content={'The Vault - DEEPSPACE Ship NFT Staking'} />
                        <hr className='mx-3 mt-3 mb-3' style={{ borderColor: 'gray' }} />
                        <div className="helper-content">
                            <div className='mx-3'>
                                <div>
                                    <p className='mb-4'>Rewards (Total DPS/Day) is the total amount of DPS the pool will pay out in a 24-hour period. This is the amount of DPS that is split across all ships in the pool. Rewards per ship are adjusted based on ship level (sum of all stats) and texture rarity. The higher level the ship, the more of the pool rewards you will receive.</p>
                                    <p className='mb-4'><b>WARNING:</b> Ships submitted to High-Risk pools have a 25% to 75% chance to be destroyed / burned on pool entry, this chance is adjusted by the ships Luck stat. A ship with a Luck value of 1, will have a 75% chance of being burned. This is reduced by 1% for every 2 Luck, to a minimum of 25%.</p>
                                    <p className='mb-4'>Estimated DPS per ship per day displayed on each staking pool is an average and does not account for level or texture rarity adjustments.</p>
                                    <p className='mb-4'>To enter a staking pool, click Stake on the pool you wish to enter, select the ships to stake when prompted to Select Ships, then click Stake again to enter them into the pool.</p>
                                </div>
                                <div className='flex flex-wrap justify-between helper-table'>
                                    <table className='mt-3'>
                                        <thead>
                                            <tr><th colSpan={2}>1 – 2 Star Safe Pool  </th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Total DPS/Day:</td><td>4800</td></tr>
                                            <tr><td>Chance to burn NFT:</td><td>0%</td></tr>
                                        </tbody>
                                    </table>
                                    <table className='mt-3'>
                                        <thead>
                                            <tr><th colSpan={2}>1 - 2 Star High Risk Pool </th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Total DPS/Day:</td><td>9600</td></tr>
                                            <tr><td>Chance to burn NFT:</td><td>25% - 75%</td></tr>
                                        </tbody>
                                    </table>
                                    <table className='mt-3'>
                                        <thead>
                                            <tr><th colSpan={2}>3 – 5 Star Safe Pool </th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Total DPS/Day:</td><td>4800</td></tr>
                                            <tr><td>Chance to burn NFT:</td><td>0%</td></tr>
                                        </tbody>
                                    </table>
                                    <table className='mt-3'>
                                        <thead>
                                            <tr><th colSpan={2}>3 - 5 Star High Risk Pool </th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Total DPS/Day:</td><td>9600</td></tr>
                                            <tr><td>Chance to burn NFT:</td><td>25% - 75%</td></tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div className='mb-3'>
                                    <table className='w-full mt-3'>
                                        <thead>
                                            <tr><th colSpan={2}>Texture Rarity Adjustments</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Common / Gray</td><td>1x</td></tr>
                                            <tr><td>Uncommon / Green</td><td>1.05x</td></tr>
                                            <tr><td>Rare / Blue </td><td>1.25x</td></tr>
                                            <tr><td>Legendary / Orange</td><td>1.5x</td></tr>
                                            <tr><td>Mythic / Pink</td><td>2x</td></tr>

                                        </tbody>
                                    </table>
                                </div>
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
