import styles from "../../styles/galactic-store/Layout.module.scss";
import Image from "next/image";
import { getGalacticItems } from "../../services/graph/hooks/deepspace";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { bnb_decimal } from "../../constants";
import { GSListing } from "../../interface/galactic-store/gs-route";
import bnbLogo from "../../asset/image/logos/BNB_logo.svg";
import getBreakpoints from "../../services/responsive";
import { consumableItemsData, nonConsumableItemsData } from "../../constants/galactic-store/items";

interface ContentPanelProps {
  listing: GSListing
  test: () => void
}

export default function ContentPanel(props: ContentPanelProps): JSX.Element {
  const breakpoints = getBreakpoints();
  const [showConsumables, setShowConsumables] = useState(true)
  const [consumableItems, setConsumableItems] = useState([])
  const [nonConsumableItems, setNonConsumableItems] = useState([])
  const { data: galacticItems } = getGalacticItems();

  useEffect(() => {
    if (galacticItems) {
      setConsumableItems(galacticItems?.consumables ?? [])
      setNonConsumableItems(galacticItems?.nonConsumables ?? [])
    }
  }, [galacticItems])

  useEffect(() => {
    setShowConsumables(props.listing.config?.hasConsumables)
  }, [props])

  const items = () => showConsumables ? consumableItems : nonConsumableItems

  const switchItemType = () => {
    if (props.listing.config?.hasConsumables && props.listing.config?.hasNonConsumables) {
      setShowConsumables(!showConsumables)
    }
  }

  const getItemName = (itemId: string): string => {
    const data = showConsumables ? consumableItemsData : nonConsumableItemsData
    return data.find(i => i.id === itemId)?.name ?? ''
  }

  const getItemListedQty = (itemId: string): number => {
    const data = showConsumables ? consumableItemsData : nonConsumableItemsData
    return data.find(i => i.id === itemId)?.listedQty ?? 0
  }

  const getItemSoldQty = (itemId: string): number => {
    const data = showConsumables ? consumableItemsData : nonConsumableItemsData
    return data.find(i => i.id === itemId)?.soldQty ?? 0
  }

  return (
    <>
      <div className={`${styles.container} flex px-5 h-28 items-center`}>
        <div className={`${styles.categoryIconWrapper} h-20 w-20 flex items-center justify-center p-1.5`}>
          <Image src={props.listing.icon} width="70%" height="70%"/>
        </div>

        <div className="flex flex-col flex-auto px-3 justify-between h-full pt-2">
          <div className="flex flex-col flex-auto justify-end">
            <h1 className="text-3xl flex flex-col">{props.listing.name}</h1>
            <div className={`${styles.dividerLarge}`}></div>
          </div>

          <div className="flex items-center flex-auto h-8">
            <div className="flex flex-auto">
              {!breakpoints.lg &&
                  <div className={styles.pageOptionStandalone}
                       onClick={props.test}>
                  Menu
              </div>}
              <div className={styles.pageOptionStandalone}>
                Inventory
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.pageOptions} flex items-center ${breakpoints.lg ? 'justify-end' : 'justify-center'} mt-2 mr-2`}>
        {props.listing.config.hasConsumables &&
            <div className={`${showConsumables ? styles.pageOptionSelected : styles.pageOption} w-48`}
                 onClick={switchItemType}>
                Consumables
            </div>}
        {props.listing.config.hasNonConsumables &&
            <div className={`${showConsumables ? styles.pageOption : styles.pageOptionSelected} w-48`}
                 onClick={switchItemType}>
                Non-Consumables
            </div>}
      </div>

      <div className="flex flex-auto flex-col p-2 overflow-auto">
        <div className={`${styles.tableRow} ${styles.tableHeader}`}>
          <div className={styles.tableCell}>Supply</div>
          <div className={styles.tableCell}>
            <span className="mr-1">Cost</span>
            <Image src={bnbLogo} width="14px" height="14px"/>
          </div>
          {breakpoints.lg && <div className={styles.tableCell}>Listed</div>}
          {breakpoints.lg && <div className={styles.tableCell}>Sold</div>}
        </div>
        {items().map((item, index) => (
          <div className={styles.tableRowSelectable} key={index}>
            <div className={`${styles.tableCell} ${styles.tableCellName}`}>
              {getItemName(item.id)}
              {!breakpoints.lg &&
              <div className="flex flex-wrap">
                {getItemListedQty(item.id) > 0 && <div className={styles.tag}>Listed: {getItemListedQty(item.id)}</div>}
                {getItemSoldQty(item.id) > 0 && <div className={styles.tag}>Sold: {getItemSoldQty(item.id)}</div>}
              </div>}
            </div>
            <div className={styles.tableCell}>{item.numLimit}</div>
            <div className={styles.tableCell}>{ethers.utils.formatUnits(item.price, bnb_decimal).toString()}</div>
            {breakpoints.lg && <div className={styles.tableCell}>{getItemListedQty(item.id)}</div>}
            {breakpoints.lg && <div className={styles.tableCell}>{getItemSoldQty(item.id)}</div>}
          </div>
        ))}
      </div>
    </>
  )
}