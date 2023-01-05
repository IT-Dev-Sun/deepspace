import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import item from '../../asset/image/dps_tank.png'
import bnbSymbol from '../../asset/image/bnb_symbol.svg'
import Image from 'next/image';
import GalacticStoreModal from '../../components/Modal/GalacticStoreModal'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ethers } from "ethers"
import { useDPSToken } from '../../hooks/Tokens'
import { bnb_decimal } from '../../constants'
import { ToastContainer } from 'react-toastr';


const Style = styled.div`
  padding: 5px 10px 20px 10px;
  background: url('/images/card/layout.png');
  background-size: 100% 100%;
  float: left;
  margin: 20px;
  & {
    header {
      width: 50%;
      height: 25px;
      margin-left: 50%;
      background: url('/images/card/input.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      padding: 3px 5px;
      position: relative;
      margin-top: 2px;
      &>span:last-child {
        position: absolute;
        right: 10px;
      }
    }
    section {
      margin: 5px 0;
      padding: 5px;
      background: url('/images/card/rectangle.png');
      background-size: 100% 100%;
      &>div:first-child {
        color: white;
        margin-top: 5px 0;
        margin-right: 5px;
        text-align: right;
      }
      &>div:nth-child(2) {
        padding: 20px;
      }
      &>div:last-child {
        color: white;
        background: url('/images/card/button.png');
        background-size: 100% 100%;
        text-align: center;
        padding-bottom: 2px;
        width: 90%;
        margin: 0 auto;
        font-size: 12px;
        margin-bottom: 10px;
      }
    }
    footer {
      color: white;
      background: url('/images/card/buy.png');
      background-size: 100% 100%;
      text-align: center;
      cursor: pointer;
      margin-top: 10px;
      margin-bottom: 5px;
    }
  }
`
const GridCard = (props) => {
  let container;
  const [c, setC] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [storeItem, setStoreItem] = useState(null)
  const { account } = useActiveWeb3React()
  const token = useDPSToken()

  useEffect(() => {
    setC(container);
  }, [container])

  useEffect(() => {
    console.log(props)
    setStoreItem({ ...props.data, category: props.category })
  }, [props])

  const onClickBuy = () => {
    if (account) {
      setShowModal(true)
    } else {
      showToastr('accountDisconnect')
    }
  }

  const showToastr = (status) => {
    if (c) {
      if (status === 'accountDisconnect') c.error("Please connect wallet", "Error");
      if (status === 'lessBalance') c.error("Balance is not enough.", "Error");
      if (status === 'approveSuccess') c.success(`Approve success. Please click confirm.`, 'Success');
    }
  }

  const itemPrice = ethers.utils.formatUnits(props.data.price, bnb_decimal).toString()

  return (
    <Style>
      {storeItem && (
        <>
          <header>
            <Image unoptimized={true} src={bnbSymbol} width="18px" height="18px" />
            <span>{itemPrice}</span>
          </header>
          <section>
            <div>50/100</div>
            <div>
              <Image src={item} alt='' width='130' height='100' />
            </div>
            <div>{props.data?.dsp_name}</div>
          </section>
          <footer onClick={() => onClickBuy()}>BUY</footer>
        </>
      )}

      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
      {account && (
        <GalacticStoreModal show={showModal} onClose={() => setShowModal(false)} storeItem={storeItem} showToastr={showToastr} />
      )}
    </Style>
  )
}

export default GridCard