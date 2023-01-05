import React, { useEffect, useState } from 'react'
import GridCard from './GridCard'
import styled from 'styled-components'
import { getGalacticItems } from '../../services/graph/hooks/deepspace'


const Wrapper = styled.div`
  width: 1224px;
  margin: 30px 0;
  @media(max-device-width:850px) {
    width: auto !important;
    &>div {
      float: initial !important;
      margin: 0 auto;
      margin-bottom: 30px;
    }
  }
`

const Sub = () => {

  const [consumableItems, setConsumableItems] = useState([])
  const [nonConsumableItems, setNonConsumableItems] = useState([])
  const { data: galacticItems } = getGalacticItems();

  useEffect(() => {
    if (galacticItems) {
      setConsumableItems(galacticItems?.consumables)
      setNonConsumableItems(galacticItems?.nonConsumables)
    }
  }, [galacticItems])

  return (
    <Wrapper>

      {consumableItems.length > 0 && consumableItems.map((consumableItem, index) => {
        return (
          <GridCard data={consumableItem} key={index} category="consumable" />
        )
      })}

      {nonConsumableItems.length > 0 && nonConsumableItems.map((nonconsumableItem, index) => {
        return (
          <GridCard data={nonconsumableItem} key={index} category="nonConsumable" />
        )
      })}

    </Wrapper>
  )
}

export default Sub