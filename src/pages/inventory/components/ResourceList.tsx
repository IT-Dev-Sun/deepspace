import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Image from 'next/image';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../state'
import { setResourceConfirm, setResourceConfirmWithNumber } from '../../../state/bridge/actions'
import { RESOURCE_LIST } from '../../../constants/deepspace'
import arrow from '../../../asset/image/bridge/arrow.png'

const Wrapper = styled.div`
  width: 100%;
  height: ${(props) => props.type === 'confirm' ? '50px' : '60px'};
  border: solid 2px #00AEEE;
  position: relative; 
  .arrow-img {
    position: absolute;
    margin-left: 12px;
  }
  @media(max-width:1030px) {
    .input-num {
      top: 51px;
    }
  }
           
`
const BackGround = styled.div`
  width: 100%;
  height: ${(props) => props.type === 'confirm' ? '46px' : '56px'};
  background: black;
  opacity: 0.3;    
`
const List = styled.div`
  width: 100%;
  height: ${(props) => props.type === 'confirm' ? '47px' : '57px'};
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  top: 0px;
  
`
const ResourceItem = styled.div`
  position: relative;
  width: ${(props) => props.type === 'confirm' ? '35px' : '40px'};
  height: ${(props) => props.type === 'confirm' ? '35px' : '40px'};
  border: solid 1px #00AEEE;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const Quantity = styled.span`
  position: absolute;
  right: 1px;
  bottom: -3px;
  font-family: monospace;
`
const InputStyle = styled.div`
  position: absolute;
  top: 66px;
  width: 100px;
  height: 20px;
  margin-left: -30px;
  border: solid 1px #00AEEE;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Input = styled.input`
  font-size: 12px;
  padding: 10px;
  width: 100px;
  height: 20px;
  border: none;
  background: transparent;
  color: white;
`;

const ADDBtn = styled.button`
font-size: 9px;
position: absolute;
width: 24px;
height: 14px;
right: -8px;
background: #00AEEE;
color: white;
display: flex;
align-items: center;
justify-content: center;
margin-right: 10px;
`

const ResourceList = (props) => {

  const [bridgeOutResources, setBridgeOutResources] = useState([])
  const [value, setValue] = useState<any>(0);
  const [active, setActive] = useState(null)
  const [resouceNum, setResourceNum] = useState(0)

  const dispatch = useDispatch<AppDispatch>()

  const setResourceToConfirm = (item: any) => {
    if (item.quantity <= 0) {
      props.error('noResource')
    } else {
      dispatch(setResourceConfirm(item))
    }
  }

  useEffect(() => {
    if (props.bridgeOutResources?.length > 0) {
      const bridgeOutItems = props.bridgeOutResources;
      let avail_resources = []
      RESOURCE_LIST.map((item: any, index: number) => {
        bridgeOutItems.map((bridgeItem, key) => {
          if (bridgeItem.resourceId === item.pid) {
            const netItem = { ...item, quantity: bridgeItem.balance }
            avail_resources.push(netItem)
          }
        })
      })
      setBridgeOutResources(avail_resources)
    }
  }, [props.bridgeOutResources])

  const handleChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (re.test(e.target.value)) {
      setResourceNum(Number(e.target.value))
    }
    if (e.target.value === '') {
      setResourceNum(0)
    }
  }

  const handleAdd = (item) => {
    if (resouceNum === 0) {
      props.error('noSelectResourceNum')
    } else {
      if (resouceNum > item.quantity) {
        props.error('noAvailableResource')
      } else {
        dispatch(setResourceConfirmWithNumber({ item: item, resouceNum: resouceNum }))
        setResourceNum(0)
      }
    }

  }

  const handleAddBridgeOut = (item) => {
    if (resouceNum === 0) {
      props.error('noSelectResourceNum')
    } else {
      if (resouceNum > item.quantity) {
        props.error('noAvailableResource')
      } else {
        props.confirmBridgeOutResource(item, resouceNum)
        setResourceNum(0)
      }
    }

  }


  return (
    <Wrapper type={props.type}>
      <BackGround type={props.type}></BackGround>
      <List type={props.type}>
        {props.availResources && props.availResources.map((item, index) => {
          return (
            <div className="resource-container" key={index}>
              <ResourceItem type={props.type} onClick={() => {
                if (active === index) {
                  setActive(null)
                } else {
                  setActive(index)
                }
              }}>
                <Image src={item.img} width={25} height={25} />
                <Quantity>{item?.quantity}</Quantity>
              </ResourceItem>

              {(active === index) && (
                <>
                  <div className='arrow-img'>
                    <Image src={arrow} alt="arrow-img" />
                  </div>
                  <InputStyle className="input-num">
                    <Input type="text" placeholder="Quantity" pattern="[0-9]*" onChange={handleChange} value={resouceNum} />
                    <ADDBtn onClick={() => { handleAdd(item); }}>ADD</ADDBtn>
                  </InputStyle>
                </>
              )}
            </div>
          )
        })}

        {(bridgeOutResources.length > 0 && props.bridgeOutResources) && bridgeOutResources.map((item, index) => {
          return (
            <div className="resource-container" key={index}>
              <ResourceItem type={props.type} onClick={() => {
                if (active === index) {
                  setActive(null)
                } else {
                  setActive(index)
                }
              }}>
                <Image src={item.img} width={25} height={25} />
                <Quantity>{item?.quantity}</Quantity>
              </ResourceItem>

              {(active === index) && (
                <InputStyle className="input-num">
                  <Input type="number" placeholder="Quantity" pattern="[0-9]*" onChange={handleChange} value={resouceNum} />
                  <ADDBtn onClick={() => { handleAddBridgeOut(item); }}>ADD</ADDBtn>
                </InputStyle>
              )}

            </div>
          )
        })}

      </List>
    </Wrapper>
  )
}

export default ResourceList