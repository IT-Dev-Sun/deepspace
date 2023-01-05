import React, { useEffect, useState } from 'react'
import Polling from '../Polling'
import styled from 'styled-components'
import axios from 'axios'
import { SERVICE_API_URL } from '../../constants'
import config from '../../config'
import cookie from 'cookie-cutter'

const Style = styled.div`
  position: relative;
  top: -1rem;
  flex: 1 0 auto;
  border-top: 1rem solid rgba(13, 11, 16, 0.9);
  
  .footer {
    position: relative;
    top: -1rem;
    
    .footer-border {
      border-bottom: 1px solid rgba(127, 22, 211, 0.4);
    }
  }
  
  .service_status {
    color: rgb(75, 255, 255);
    margin-right: 20px;
  }
`

const Footer = () => {

  const [serverStatus, setServerStatus] = useState('')

  useEffect(() => {
    checkService();
  }, [])

  const checkService = async () => {
    const serviceResponse = await axios.get(SERVICE_API_URL);
    const server_list = serviceResponse?.data?.servers_list
    if (server_list.length > 0) {
      server_list.map((item) => {
        if (config.ENVIRONMENT === item.server_environment.toUpperCase()) {
          setServerStatus(item.global_server_status)
        }
      })
    }
  }

  return (
    <Style>
      <footer className="bottom-0 right-0 items-end justify-center hidden mx-auto footer flex flex-col
                         text-center md:flex sm:visible w-screenpx-4 text-low-emphesis">
        <div className="footer-border w-full"/>
        <div className="flex items-center justify-end px-10 pb-3 h-14">
          <div className='service_status goldman-font'>
            <span>Status: {serverStatus} </span>
          </div>
          <Polling/>
        </div>
      </footer>
    </Style>

  )
}

export default Footer
