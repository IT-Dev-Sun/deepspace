import React, { useState } from 'react'
import SidePanel from "../../components/GalacticStore/SidePanel";
import ContentPanel from "../../components/GalacticStore/ContentPanel";
import { GSListing } from "../../interface/galactic-store/gs-route";
import listings from '../../constants/galactic-store/listings'
import styles from "../../styles/galactic-store/Layout.module.scss";
import getBreakpoints from "../../services/responsive";
import Default from "../../layouts/Default";

const GalacticStore = () => {
  const breakpoints = getBreakpoints();
  const [activeRoute, setActiveRoute] = useState('chemicals')
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(true)

  const getActiveListing = (): GSListing => listings.find(r => r.id === activeRoute)
  const toggleSidePanel = (): void => setSidePanelCollapsed(!sidePanelCollapsed)

  const onSidePanelWrapperClick = (e: any) => {
    if (!JSON.stringify(e.target['className']).includes('sidePanelHandsetWrapper')) {
      return
    }

    toggleSidePanel();
  }

  const onRouteClick = (routeId: string) => {
    setActiveRoute(routeId)
    toggleSidePanel()
  }

  return (
    <div className="goldman-font flex w-full">
      <div className={`${breakpoints.lg ? styles.sidePanelWrapper : `${styles.sidePanelHandsetWrapper} ${sidePanelCollapsed ? 'w-0' : 'w-full bg-black/75'}`} transition-all`}
      onClick={onSidePanelWrapperClick}>
        <SidePanel routes={listings}
                   activeRoute={activeRoute}
                   onRouteClick={onRouteClick}
                   onClose={toggleSidePanel}/>
      </div>

      <div className={breakpoints.lg ? styles.contentPanel : styles.contentPanelHandset}>
        {getActiveListing() && (
          <ContentPanel listing={getActiveListing()} test={toggleSidePanel}/>
        )}
      </div>
    </div>
  )
}

export default GalacticStore

GalacticStore.Layout = Default