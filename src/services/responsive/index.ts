import { useMediaQuery } from "react-responsive";

const getBreakpoints = () => ({
  sm: useMediaQuery({ query: '(min-width: 640px)' }),
  md: useMediaQuery({ query: '(min-width: 768px)' }),
  lg: useMediaQuery({ query: '(min-width: 1024px)' }),
  xl: useMediaQuery({ query: '(min-width: 1280px)' }),
  xxl: useMediaQuery({ query: '(min-width: 1536px)' }),
})

export default getBreakpoints