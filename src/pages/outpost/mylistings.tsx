import Head from 'next/head'
import React, { useState } from 'react'
import Container from '../../components/Container'
import ShipCard from '../../components/ShipCard'
import OutPostLayout from '../../layouts/OutPostLayout'
import CustomModal from '../../components/Modal/CustomModal'

export default function MyListings() {
  const [showModal, setShowModal] = useState(false)
  return (
    <Container maxWidth="full" className="w-full px-2 py-4 md:px-48 md:py-8 xl:py-12">
      <div className="relative flex flex-col justify-center w-full">
        <div className="inline-flex flex-wrap justify-center mx-auto"></div>
      </div>

      <CustomModal show={showModal} onClose={() => setShowModal(false)} shipCardType="unlist-ship" />
    </Container>
  )
}

MyListings.Layout = OutPostLayout
