import {
  defaultGSConsumablesListConfig as consList,
  defaultGSItemListConfig as defaultList,
  defaultGSNonConsumablesListConfig as nonConsList,
  GSListing
} from "../../interface/galactic-store/gs-route";
import chemicals from "../../asset/image/icons/chemicals.svg";
import consumer from "../../asset/image/icons/consumer.svg";
import metal from "../../asset/image/icons/metal.svg"
import mineral from "../../asset/image/icons/mineral.svg"
import technology from "../../asset/image/icons/technology.svg"
import weapon from "../../asset/image/icons/weapon.svg"
import cores from "../../asset/image/icons/cores.svg"

const listings: GSListing[] = [
  { id: 'chemicals', name: 'Chemicals', icon: chemicals, config: defaultList },
  { id: 'consumer', name: 'Consumer Items', icon: consumer, config: defaultList },
  { id: 'cores', name: 'Cores', icon: cores, config: consList },
  { id: 'metals', name: 'Metals', icon: metal, config: nonConsList },
  { id: 'minerals', name: 'Minerals', icon: mineral, config: consList },
  { id: 'technology', name: 'Technology', icon: technology, config: nonConsList },
  { id: 'weapons', name: 'Weapons', icon: weapon, config: defaultList },
]

export default listings