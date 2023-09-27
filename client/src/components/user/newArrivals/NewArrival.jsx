import React from 'react'
import NewCard from './NewCard'
import "./newArrival.css"
import { resourceForm } from '../../../resources/resourceVN'

export default function NewArrival() {
  return (
    <>
    <section className='NewArrivals flash background'>
      <div className='container'>
        <div className='heading d_flex'>
          <div className='heading-left mb-2 f_flex'>
            <img src='https://img.icons8.com/glyph-neue/64/26e07f/new.png' />
            <h2>{resourceForm.headingArrival}</h2>
          </div>
          <div className='heading-right '>
            <span>{resourceForm.view}</span>
            <i className='fa-solid fa-caret-right'></i>
          </div>
        </div>

        <NewCard />
      </div>
    </section>
  </>
  )
}
