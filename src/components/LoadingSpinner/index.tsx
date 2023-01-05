import React, { useEffect } from 'react';
import Lottie from 'react-lottie';
import * as successLoading from './successLoading.json'
import * as failedLoading from './failedLoading.json'
import styled from 'styled-components'
const SpinnerStyle = styled.div`
.loading-spinner{
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 100000;
    // background-color: rgba(80,0,80,0.2);
    background-color: rgba(0,0,0,0.7);
  }
`
export default function LoadingSpinner({ status, handleLoading }) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: status === 2 ? successLoading : failedLoading,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    useEffect(() => {
        if (status === 3) {
            setTimeout(() => {
                handleLoading(0);
            }, 2000)
        }
    }, [status]);
    return (
        <SpinnerStyle>
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full loading-spinner">
                <div className="px-5 py-10">
                    <div className='flex justify-center spinner-section'>
                        {
                            (status === 2 || status === 3) && (
                                <Lottie options={defaultOptions}
                                    height={250}
                                    width={250}
                                    isStopped={false}
                                    isPaused={false} />
                            )
                        }
                        {
                            status === 1 && (

                                <div>
                                    <div className="swing">
                                        <div className="swing-l"></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div className="swing-r"></div>
                                    </div>
                                    <div className="shadow">
                                        <div className="shadow-l"></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div className="shadow-r"></div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </SpinnerStyle>
    )
}
