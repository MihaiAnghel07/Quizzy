import React from 'react'
import './home.css'
import { ImageData } from '../../components/imageSlider/JsonData'
import ImageSliderAuto from '../../components/imageSlider/ImageSliderAuto'

export default function Home() {
  return (
    <div className='Home'>
        <h2>HomePage</h2>
        <div className='ImageAutoSlider'>
          {/* <ImageSlider ImageData={ImageData}/><br/> */}
          <ImageSliderAuto ImageData={ImageData} SlideInterValTime={2000}/>
        </div>
    </div>
  )
}
