import React from 'react'

interface NFTCardProps {
  type: string
  address: string
  id: string
  className?: string
}

function NFTCardProps({
  type = undefined,
  address = undefined,
  className = undefined,
  id = undefined
}: NFTCardProps) {

  return (
    <div
      className={`relative ${className}`}>
      <div className="pb-4 sm:pb-4">
        <div className="flex items-center justify-center">
          <div className="nft-image-outer">
            <video autoPlay={true} className="nftImage" muted loop>
              <source src={address} type="video/webm" />
            </video>
          </div>
        </div>
        <div className="flex items-center justify-center mt-2">
          {type && <div className="text-xl text-high-emphesis">{type}</div>}
        </div>
      </div>
    </div>
  )
}

export default NFTCardProps
