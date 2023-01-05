import { useShipSelects } from "../state/others/hooks";
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export function useCardCount(dom_width):number{
  // dom_width = Number(dom_width) - 24 * 2;
  // if(dom_width < 284 )dom_width=284;
  // console.log((~~(dom_width/284)*useShipSelects() ));
  // return (~~(dom_width/284)*useShipSelects() );
  const ships = useShipSelects();
  return ships;
}