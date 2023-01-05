import React from 'react'
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import cn from 'classnames';

function Pagination({ handlePagination, data, pageName }) {
  return (
    <div className="w-full">
      <div className={cn("flex justify-center w-full p-2 text-lg font-bold pagination", {
        'pagination-mobile': pageName !== 'staking'
      })} style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#4BFFFF" }}>
        <div className="relative w-full">
          <div className="flex items-center justify-center w-full">
            <div className="p-1 cursor-pointer" onClick={() => { handlePagination(-1) }}><BiChevronLeft className="text-2xl font-bold" /></div>
            <div className="pl-3 pr-3">
              <span className="px-1">{data.cur_pos + 1}</span>
            </div>
            <div className="p-1 cursor-pointer" onClick={() => { handlePagination(1) }}> <BiChevronRight className="text-2xl font-bold" /> </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagination;