import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import InputNav from '../inputNav'

const Dropdown = ({ RESOURCE_LIST, selectResource, account, showErrorConnectToastr }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)                 //left dropdown
  const [selectedItem, setSelectedItem] = useState<any>(null)
  useEffect(() => {
    window.onclick = function (event) {
      if (!event.target.matches('.fixPositionFirst') && !event.target.matches('nav') && !event.target.matches('span') && !event.target.matches('.arrow.down')) {
        setDropdownOpen(false)
      }
    }
  }, [dropdownOpen])
  const onClick = (res) => {
    if (account === null) {
      showErrorConnectToastr('disconnect')
    } else {
      selectResource(res)
      setSelectedItem(res)
      setDropdownOpen(false)
    }
  }
  return (
    <>
      <div className="dropdown">
        <div onClick={() => setDropdownOpen(!dropdownOpen)} className='dropbtn'>
          <InputNav width={'185px'} height={'30px'}>
            <span className='fixPositionFirst'>Receive</span>
            {selectedItem ? (
              <span className='middlePosition'>
                <Image src={selectedItem.img} width={'20px'} height={'20px'} />
                <span>{selectedItem.type}</span>
              </span>
            ) : (
                <span>Resource</span>
              )}
            <span className='arrowIcon'><i className="arrow down"></i></span>
          </InputNav>
        </div>

        {dropdownOpen && (
          <div id="myDropdown" className="dropdown-content">
            <nav></nav>
            <section className='section'>
              {RESOURCE_LIST.map((resource, index) => (
                <div className='list' key={index} onClick={() => onClick(resource)}>
                  <Image src={resource.img} width={'25px'} height={'25px'} />
                  <span>{resource.type}</span>
                </div>
              ))}
            </section>
          </div>
        )}

      </div>

    </>
  )
}

export default Dropdown