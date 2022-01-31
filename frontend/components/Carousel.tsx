import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { links } from '../util/route-links'
// import ImageGallery from 'react-image-gallery'
interface Images {
  images: any
}

const Carousel = ({ images }: Images) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<any>()
  const carouselItemsRef = useRef<HTMLDivElement[] | null[]>([])

  useEffect(() => {
    if (images && images[0]) {
      carouselItemsRef.current = carouselItemsRef.current.slice(0, images.length)

      setSelectedImageIndex(0)
      setSelectedImage(images[0])
    }
  }, [images])

  const handleSelectedImageChange = (newIdx: number) => {
    if (images && images.length > 0) {
      setSelectedImage(images[newIdx])
      setSelectedImageIndex(newIdx)
      if (carouselItemsRef?.current[newIdx]) {
        carouselItemsRef?.current[newIdx]?.scrollIntoView({
          block: 'end',
          inline: 'center',
          behavior: 'smooth',
        })
      }
    }
  }

  return (
    <div className="carousel-container">
      <div className="selected-image" style={{ backgroundImage: `url(${selectedImage?.image})` }} />
      <div className="carousel">
        <div className="carousel-images">
          {images &&
            images.map((image: any, idx: any) => (
              <div
                key={image.id}
                onClick={() => handleSelectedImageChange(idx)}
                style={{ backgroundImage: `url(${image.image})` }}
                className={`carousel-image ${selectedImageIndex === idx && 'carousel-image-selected'}`}
                ref={(el) => (carouselItemsRef.current[idx] = el)}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
