import React from 'react'
import DiscountCard from './DiscountCard'
import { resourceForm } from '../../../resources/resourceVN'

export default function Discount() {
  return (
    <>
      <section className='Discount flash background NewArrivals'>
        <div className='container'>
          <div className='heading d_flex'>
            <div className='heading-left mb-2 f_flex'>
              <img src='https://img.icons8.com/windows/32/fa314a/gift.png' />
              <h2>{resourceForm.headingDiscount}</h2>
            </div>
            <div className='heading-right'>
              <span className='cursor-pointer'>{resourceForm.view}</span>
              <i className='fa-solid fa-caret-right'></i>
            </div>
          </div>
          <DiscountCard />
        </div>
      </section>
    </>
  )
}
