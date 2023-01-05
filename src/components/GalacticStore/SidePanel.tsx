import styles from '../../styles/galactic-store/Layout.module.scss';
import Image from "next/image";
import dpsLogo from '../../asset/image/logos/DPS_logo.svg'
import bnbLogo from '../../asset/image/logos/BNB_logo.svg'
import { GSRoute } from "../../interface/galactic-store/gs-route";
import getBreakpoints from "../../services/responsive";
import { AiOutlineClose } from "react-icons/ai";
import React from "react";

interface SidePanelProps {
  routes: GSRoute[]
  activeRoute: string
  onRouteClick: (string) => void
  onClose: () => void
}

export default function SidePanel(props: SidePanelProps): JSX.Element {
  const breakpoints = getBreakpoints();
  const dashboard: GSRoute = {
    id: 'dashboard',
    name: 'Dashboard',
  }

  const getRelevantClass = (routeId: string) => {
    return routeId === props.activeRoute ? styles.menuEntryActive : styles.menuEntry
  }

  return (
    <div className={breakpoints.lg ? styles.sidePanel : styles.sidePanelHandset}>
      <div className={`${styles.container} flex items-center p-5 h-28`}>
        <div className="flex items-center mr-5">
          <Image src={dpsLogo} width="60px" height="60px"/>
        </div>

        <h2 className="text-2xl flex flex-col tracking-wider">
          <span>Galactic</span><span>Store</span>
        </h2>

        {!breakpoints.lg &&
            <AiOutlineClose onClick={props.onClose}
                            style={{ cursor: 'pointer', fontSize: "24px", position: "absolute", top: "1rem", right: "1rem" }} />}
      </div>

      <div className={`${styles.container} flex flex-col py-1.5 items-end`}>
        <div className="flex w-full px-5">
          <div className={styles.avatarWrapper}></div>

          <div className="flex flex-col">
            <span className={`${styles.textAccent} text-lg tracking-wider`}>Welcome</span>
            <span className="ml-7 text-lg">Dread</span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className="flex justify-end w-full px-5">
          <div className="flex flex-col items-end">
            <span className={`${styles.textAccent} text-lg tracking-wider`}>Balance</span>
            <span className="mr-7 text-lg">2.29 BNB</span>
          </div>

          <div className="flex items-center ml-4">
            <Image src={bnbLogo} width="40px" height="40px"/>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2 overflow-auto">
        <div className={getRelevantClass(dashboard.id)}
             onClick={() => props.onRouteClick(dashboard.id)}>
          Dashboard
        </div>

        <div className="flex items-center mb-2">
          <span className={`${styles.textSecondary} mr-2`}>Listings</span>
          <div className={styles.divider}></div>
        </div>

        {props.routes
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(route => (
            <div key={route.id}
                 className={getRelevantClass(route.id)}
                 onClick={() => props.onRouteClick(route.id)}>
              {route.name.replace('.', '')}
            </div>
          ))}
      </div>
    </div>
  )
}