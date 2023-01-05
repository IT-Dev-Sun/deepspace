import Head from 'next/head'
import React from 'react'
import Image from 'next/image'
import { Zap } from 'react-feather'
import styled from 'styled-components'


const StyledCard = styled.div`
  .main-container {
    height: 465px;
    width: 100%;
  }

  .inside-container {
    max-width: 65%;
    left: 0;
    right: 0;
    top: 140px;
    margin-left: auto;
    margin-right: auto;
  }
`

export default function Home() {
  return (
    <StyledCard>
      <div className="relative px-8 px-12 pt-24 main-container d-flex sm:py-40 md:py-36 lg:px-16 xl:py-36">
        <div className="absolute inside-container ">
          <div className="inset-0 text-center pt-28">
            <div className="sm:pb-2 md:pb-4 lg:pb-16">
              <span className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">Welcome</span>
            </div>

            <br />
            <div className="flex justify-center px-20">
              <span className="text-xl font-bold text-white body-text sm:text-2xl md:text-3xl lg:text-4xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus sed at malesuada enim turpis adipiscing.
              </span>
            </div>
          </div>
        </div>
      </div>
    </StyledCard>
  )
}
