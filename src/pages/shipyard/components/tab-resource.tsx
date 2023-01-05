import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import styled from 'styled-components'
import Tab from './tab'
import { IoHelpCircleSharp } from 'react-icons/io5'
import { useDpsResourcesContract, useActiveWeb3React, useDpsCoresContract } from '../../../hooks'
import { AppDispatch } from '../../../state'
import { useDispatch, useSelector } from 'react-redux'
import { RESOURCE_LIST, SHIP_CORE_TYPES } from '../../../constants/deepspace'
import { setShipYardAvailResources, setShipYardAvailCores } from '../../../state/shipyard/actions'
import { nftURL } from '../../../functions/deepspace';
import HelperShipyardModal from '../../../components/Modal/HelperShipyardModal'

const PageStyle = styled.div`
  width: 313px;
  height: 595px;
  @media(max-device-width:820px) {
    width: 370px;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .container {
    width: 100%;
    display: flex;
    height: 595px;
  }

  .content_container {
    width: 100%;
    border: 2px solid #00aeef;
    position: relative;
    border-left: none;
    border-bottom: none;
    padding: 10px;
    padding-bottom: 20px;
    display: flex;
    background: linear-gradient(45deg, transparent 12.5px, rgba(3, 58, 78, 0.85) 0) bottom right;
  }

  .content_holder {
    display: flex;
    width: 100%;
    height: calc(100% - 10px);
    padding: 0px 25px;
    overflow-y: scroll;
  }

  .divider {
    border-left: 2px solid #00aeef;
    position: relative;
    flex-grow: 1;
    margin-top: -2.8px;
    margin-bottom: -3px;
    background: rgba(3, 58, 78, 0.85);
  }

  .fill_top {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: -38px;
    height: 38px;
    width: 100%;
    z-index: 1;
    border-top-left-radius: 100%;
    background: linear-gradient(145deg, transparent 27.5px, rgba(3, 58, 78, 0.85) 0) top left;
}

.fill_bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: -38px;
    height: 38px;
    width: 100%;
    z-index: 1;
    border-bottom-left-radius: 100%;
    background: linear-gradient(35deg, transparent 27.5px, rgba(3, 58, 78, 0.85) 0) top left;
}

  .tab_container {
    position: relative;
    width: 41px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: transparent;
    overflow: hidden;
  }

  .top_border {
    width: 100%;
    border-top: 2px solid #00aeef;
    margin-bottom: -3px;
    z-index: 2;
  }

  .bottom_border_container {
    height: 60px;
  }

  .bottom_border {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: -1px;
    border-bottom: 2px solid #00aeef;
    width: calc(100% - 16px);
  }

  
.bottom_left_border {
  position: absolute;
  margin-left: -12px;
  margin-bottom: -11px;
  z-index: 2;
  height: 80px;
  transform: rotate(315deg);
  bottom: 0;
  left: 0;
  border-left: 2px solid #00aeef;
}

  .tab_view_content {
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 10px;
  }

  .itm_container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
  }

  .sub_itm_container {
    margin-top: 15px;
    border: 1px solid;
    height: 200px;
  }

  .title {
    margin: 7px 0px 0px;
    padding: 5px 0px;
    border-bottom: 2.5px solid #006f98;
    width: 100%;
  }

  h3 {
    font-size: 13px;
  }

  .question_icon{
    position: absolute;
    width: fit-content;
    height: fit-content;
    left: 0;
    bottom: 0;
    font-size: 25px;
    cursor: pointer;
  }
  .question_icon:hover {
    svg {
      fill: #d100a4;
      transition: fill 0.5s;
    }
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
    height: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-button:single-button:active {
    background: #006f98;;
  }
  .available-cores-title .available-resources-title{
    border-bottom: 2px solid #006f98;
    padding: 5px 0px;
    margin-bottom: 10px;
  }
  .available-cores {
    justify-content: space-evenly;

  }
  .core-item{
    width: 42.5%;
    margin-bottom: 6px;
    div:last-child {
      margin-top: 2px;
    }
  }
  .core-item-image{
    width: 100%;
    height: auto;
  }
  cores-items-holder{
    column-gap: calc(15%);
    row-gap: 10px;
    padding: 0 6px;
  }
  .resource-item{
    width: 42.5%
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
  .resouce-item-image {
    width: 100%;
    height: 100%;
    div:last-child {
      margin-top: 4px;
    }
  }
  .available-resources {
    display: flex;
    flex-wrap: wrap;
  }
  .resources-items-holder{
    column-gap: calc(15%);
    row-gap: 10px;
    padding: 0 6px;
  }
  .available-cores-title.title {
    font-size: 14px;
  }
  .available-resources-title.title {
    font-size: 14px;
    margin: 0;
    padding-top: 0;
  }
`

const TabResource = (props) => {

  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()
  const dpsResourcesContract = useDpsResourcesContract()
  const dpsCoresContract = useDpsCoresContract()

  const { avail_resources, avail_cores } = useSelector((state: any) => state.shipyard)

  const [tabs, setTabs] = useState([
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: false },
    { id: 4, active: false },
  ]);

  const [tabHelper, setTabHelper] = useState(false)

  useEffect(() => {
    if (account !== null && account !== undefined) {
      getAvailableResources()
      getAvailableCores()
    }
  }, [account])

  const getAvailableResources = async () => {
    const addresses = [account, account, account, account, account, account, account, account]
    const resourceIds = [0, 1, 2, 3, 4, 5, 6, 7]
    let resources = await dpsResourcesContract.balanceOfBatch(addresses, resourceIds);

    let avail_resources = []
    RESOURCE_LIST.map((item: any, index: number) => {
      const netItem = { ...item, quantity: Number(resources[index]._hex) }
      avail_resources.push(netItem)
    })
    dispatch(setShipYardAvailResources(avail_resources))
  }

  const getAvailableCores = async () => {
    const addresses = [account, account, account, account]
    const coresId = [0, 1, 2, 3]
    let coresData = await dpsCoresContract.balanceOfBatch(addresses, coresId);
    let avail_cores = []
    SHIP_CORE_TYPES.map((core, index) => {
      coresData.map((item, key) => {
        if (index === key) {
          const coreTypeImage = nftURL(`1/${index}/0.svg`)
          const quantity = Number(item._hex)
          const newItem = {
            img: coreTypeImage,
            pid: index,
            quantity: quantity,
            type: core
          }
          avail_cores.push(newItem)
        }
      })
    })
    dispatch(setShipYardAvailCores(avail_cores))
  }

  return (
    <PageStyle>
      <div className={"container goldman-font"}>
        <div>
          <div className={"tab_container"}>
            <div
              className={"fill_bottom"}
              style={{ top: 0, marginRight: -2, marginTop: 2 }}
            ></div>
            <div className={"top_border"}></div>
            {tabs.map((tab, index) => (
              <>
                <Tab data={tab} activeTab={setTabs} key={index} />
                <div className={"divider"}>
                  <div className={"fill_top"}></div>
                  <div className={"fill_bottom"}></div>
                </div>
              </>
            ))}

            <div className={"bottom_border_container"}>
              <div className={"question_icon"}>
                <IoHelpCircleSharp className='question-helper' onClick={() => setTabHelper(true)} />
                {/* <AiOutlineQuestionCircle className='question-helper' /> */}
              </div>
            </div>
          </div>
        </div>

        <div className={"content_container"}>
          <div className={`content_holder custom-scrollbar`}>
            <div className={"tab_view_content"}>

              {tabs[1].active && (
                <div className='flex flex-wrap available-cores'>
                  <div className='available-cores-title title'>AVAILABLE CORES</div>
                  <div className="flex flex-wrap justify-between w-full mt-3 cores-items-holder">
                    {
                      avail_cores?.map((item, index) => {
                        return (
                          <div className='core-item' key={index}>
                            <div className='text-center core-item-image'>
                              <div className='img-height-equal-as-width'>
                                <div className='item-image_holder'>
                                  <Image src={item.img} width={'60%'} height={'70%'} objectFit="contain" alt="Core type image" />
                                </div>
                              </div>
                            </div>
                            <div className='text-center'>{item.quantity}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )}

              {tabs[0].active && (
                <div className='available-resources'>
                  <div className='available-resources-title title'> AVAILABLE RESOURCES </div>
                  <div className="flex flex-wrap justify-between w-full mt-3 resources-items-holder">
                    {
                      avail_resources?.map((item, index) => {
                        return (
                          <div className='resource-item' key={index}>
                            <div className='text-center resouce-item-image'>
                              <div className='img-height-equal-as-width'>
                                <div className='item-image_holder'>
                                  <Image src={item.img} width={'100%'} height={'100%'} objectFit="contain" alt="resource img" />
                                </div>
                              </div>
                              <div className='text-center'>{item.quantity}</div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={"bottom_left_border"}></div>
          <div className={"bottom_border"}></div>
        </div>

      </div>
      {tabHelper && (
        <HelperShipyardModal show={tabHelper} type="tab-helper" onClose={() => setTabHelper(false)} />
      )}
    </PageStyle>
  )
}

export default TabResource