import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import cn from 'classnames'
import { useActiveWeb3React } from '../../../hooks'
import { RESOURCE_LIST } from '../../../constants/deepspace'
import { AppDispatch } from '../../../state'
import { useDispatch, useSelector } from 'react-redux'
import { setRequiredResources } from '../../../state/shipyard/actions'
import { IoHelpCircleSharp } from 'react-icons/io5'
import HelperShipyardModal from '../../../components/Modal/HelperShipyardModal'


const PageStyle = styled.div`
  @media(max-device-width:820px) {
    margin-bottom : 20px;
    .container {
      width: 368px !important;
      height: 155px !important;
      .bottom_border + div {
        display: none;
      }
    }
    .content_holder {
      height: 140px !important;
    }
  }
  .container {
    background-image:url(../images/shipyard/shipyard-layout.png);
    background-size: 100% 100%;
    position: relative;
    overflow-y: clip;
    height: 248px;
    width: 370px;
  }

.content_holder {
  position: absolute;
  right: 16px;
  top: 7px;
  padding-left: 16px;
  display: flex;
  width: 100%;
  height: 235px;
  padding-right: 10%;
  flex-direction: column;
  overflow-y: scroll;
  padding-left: 33px;
}
.question_icon {
  position: absolute;
  width: fit-content;
  height: fit-content;
  right: 10px;
  bottom: 0;
  font-size: 25px;
  padding-top: 33px;
  padding-left: 10px;
  z-index: 1;
  cursor: pointer;
}
.question_icon:hover {
  svg {
    fill: #d100a4;
    transition: fill 0.5s;
  }
}
.title {
  font-size: 15px;
  margin: 7px 0px 0px;
  padding: 5px 0px;
  border-bottom: 2.5px solid #006f98;
}
.scrollbar_bottom_button {
  height: 4px;
  width: 8px;
  background: #00aeef;;
  position: absolute;
  right: 6px;
  bottom: 0;
  margin-bottom: 61px;
  margin-right: 10px;
  z-index: 1;
}

.scrollbar_bottom_button:active {
  background-color: #006f98;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #00aeef; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #006f98; 
}
.custom-scrollbar::-webkit-scrollbar-button:single-button {
  background: #00aeef; 
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-button:single-button:active {
  background: #006f98;;
}
.custom-scrollbar_sec2_bottom::-webkit-scrollbar-track {
  margin-bottom: 55px;
}
.custom-scrollbar_sec2_bottom::-webkit-scrollbar-button:vertical:single-button:increment {
  height: 0px;
}
.resource-holder{
  column-gap: 8%;
  margin-top: 2px !important;
}
.resource-holder::after{
  content: "";
  flex: auto;
}
  .resource-item {
    width: 25.6%;
  }
  .resource-item>.text-center {
    margin-top: 3px;
  }
  .resource-item-image {
    width: 100%;
    height: auto;
  }

  .img-height-equal-as-width{
    position: relative;
    width: 100%;
    padding-top: 100%;
  }
  .item-image_holder{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-item: center;
    border: solid 2px #00aeef;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .item-image_holder:hover, .item-image_holder.active{
    background-color:#0279a5;
  }
  .title {
    font-size: 13px;
    line-height: 13px;
    margin: 0 !important;
  }
`

const SelectedResource = (props) => {

  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()
  const [chooseResourceItem, setChooseResourceItem] = useState(0)
  const [calResources, setCalResources] = useState(null)
  const { required_resources } = useSelector((state: any) => state.shipyard)

  const [requiredResourceHelper, setRequiredResourceHelper] = useState(false)


  //codes for custom scroll button down
  const scrollbar = useRef<any>({});
  const scrollDownStartRef = useRef(null);
  const scrollDownScrollingRef = useRef(null);

  useEffect(() => {
    if (account !== null && account !== undefined) {
      getInitialResources()
    }
  }, [account])

  useEffect(() => {
    arrangeRequiredRes(required_resources)
  }, [required_resources])

  const arrangeRequiredRes = (required_resources) => {
    let arr = [];
    required_resources.map((resource) => {
      if (resource.quantity > 0) {
        arr.push(resource)
      }
    })
    setCalResources(arr)
  }

  const getInitialResources = async () => {
    let require_resources = []
    RESOURCE_LIST.map((item: any, index: number) => {
      const netItem = { ...item, quantity: 0 }
      require_resources.push(netItem)
    })
    dispatch(setRequiredResources(require_resources))
  }

  const handleScrollDownClick = () => {
    scrollbar.current.scrollTo({
      top: scrollbar.current.scrollTop + 40,
      behavior: "smooth",
    });
  };

  const handleScrollDownHold = ({ stopScroll }) => {
    if (!stopScroll) {
      scrollDownStartRef.current = setTimeout(() => {
        scrollDownScrollingRef.current = setInterval(() => {
          scrollbar.current.scrollTo({
            top: scrollbar.current.scrollTop + 15,
          });
        }, 20);
      }, 200);
    } else {
      clearTimeout(scrollDownStartRef.current);
      if (!scrollDownScrollingRef.current) handleScrollDownClick();
      clearInterval(scrollDownScrollingRef.current);
      scrollDownScrollingRef.current = null;
    }
  };
  const ReIndicator = styled.div`
  & {
    position: absolute;
    height: 20px;
    width: 20px;
    top: -1px;
    margin-top: 105px;
    transform: rotate(45deg);
    background: linear-gradient(45deg, transparent 12px, rgb(0, 174, 239) 0px) left top;
    margin-right: -12px;
    right: 0px;
  }
`
  return (
    <PageStyle>
      <div className={"container goldman-font"}>
        <div
          className="scrollbar_bottom_button"
          onMouseDown={() => handleScrollDownHold({ stopScroll: false })}
          onMouseUp={() => handleScrollDownHold({ stopScroll: true })}
        ></div>

        <div className={"question_icon"}>
          <IoHelpCircleSharp className='question-helper' onClick={() => setRequiredResourceHelper(true)} />
        </div>
        <div ref={scrollbar} className={`content_holder custom-scrollbar custom-scrollbar_sec2_bottom`}>

          <div className={"title"}>
            <h3>RESOURCES REQUIRED FOR SELECTED UPGRADES</h3>
          </div>

          <div className='flex flex-wrap justify-between w-full mt-3 available-detail resource-holder'>
            {
              calResources?.map((item, key) => {
                return (
                  <div className='resource-item' key={key} >
                    {item.quantity > 0 && (
                      <>
                        <div className={cn('text-center resource-item-image', { 'active': key === chooseResourceItem })} >
                          <div className='img-height-equal-as-width'>
                            <div className='item-image_holder'>
                              <Image src={item.img} width={'100%'} height={'100%'} objectFit="contain" alt="required resouces" />
                            </div>
                          </div>
                        </div>
                        <div className='text-center' style={{ fontSize: '12px' }}>{item.quantity}</div>
                      </>
                    )}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {requiredResourceHelper && (
        <HelperShipyardModal show={requiredResourceHelper} type="required-resouce-helper" onClose={() => setRequiredResourceHelper(false)} />
      )}
    </PageStyle>
  )
}

export default SelectedResource