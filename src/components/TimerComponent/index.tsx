import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import styled from 'styled-components'

const ComponentStyle = styled.div`
    .time-header{
        font-size:18px;
        padding-right:12px;
        color:cyan;
        margin-bottom:3px;
    }
    .timer-section{
        margin-bottom:6px;
    }
    .time-title{
        text-align:center;
        font-size:12px;
    }
    .time-value{
        background-color:#404549;
        font-size:21px;
        border-radius:5px;
        color:white;
        margin:0px 1px;
        border:1px solid white;
        width:38px;
        height:43px;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    .time-dot{
        font-size:18px;
        font-weight:bold;
        margin-top:16px;
        margin-left:3px;
        margin-right:3px;
    }
    @media(max-width:768px){
        .time-header{
            width:100%;
            margin-bottom:6px;
        }
        
        .timer-section{
            margin-bottom:12px;
        }
    }
    @media(max-width:437px){
        .time-header{
            width:100%;
            margin-bottom:6px;
        }
        .time-value{
            font-size:16px;
            width:28px;
            height:33px;
        }
        .timer-section{
            margin-bottom:12px;
        }
    }
`
interface ComponentProps {
  expiryTimestamp: any
  handleTimer?: () => void
  content: string
}
export default function TimerComponent({ expiryTimestamp, handleTimer, content }: ComponentProps) {
  const {
    seconds,
    minutes,
    hours,
    days,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (!!handleTimer) handleTimer();
      console.warn('onExpire called')
    }
  });

  useEffect(() => {
    restart(expiryTimestamp);
  }, [expiryTimestamp])


  return (
    <ComponentStyle>
      <div className='flex flex-wrap items-center justify-center'>
        <div className='w-full text-center time-header goldman-font'>
          <span>{content}</span>

        </div>
        <div className='flex items-center justify-center timer-section'>
          <div className='time-element'>
            <div className='time-title'>Days</div>
            <div className='flex justify-center goldman-font'>
              <div className='time-value'><span>{days < 10 ? '0' : Math.floor(days / 10)}</span></div>
              <div className='time-value'><span>{days % 10}</span></div>
            </div>
          </div>
          <div className='flex items-center time-dot'><span>:</span></div>
          <div className='time-element'>
            <div className='time-title'>Hours</div>
            <div className='flex justify-center goldman-font'>
              <div className='time-value'><span>{hours < 10 ? '0' : Math.floor(hours / 10)}</span></div>
              <div className='time-value'><span>{hours % 10}</span></div>
            </div>
          </div>
          <div className='time-dot'><span>:</span></div>
          <div className='time-element'>
            <div className='time-title'>Minutes</div>
            <div className='flex justify-center goldman-font'>
              <div className='time-value'><span>{minutes < 10 ? '0' : Math.floor(minutes / 10)}</span></div>
              <div className='time-value'><span>{minutes % 10}</span></div>
            </div>
          </div>
          <div className='time-dot'><span>:</span></div>
          <div className='time-element'>
            <div className='time-title'>Seconds</div>
            <div className='flex justify-center goldman-font'>
              <div className='time-value'><span>{seconds < 10 ? '0' : Math.floor(seconds / 10)}</span></div>
              <div className='time-value'><span>{seconds % 10}</span></div>
            </div>
          </div>
        </div>
      </div>
    </ComponentStyle>
  )
}