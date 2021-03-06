import React from 'react';
import { Carousel } from 'react-bootstrap';
import './Slideshow.css'

const CarouselContainer = () => {
    return (
        <Carousel controls={false}>
            <Carousel.Item interval={5000}>
                <img
                    src='https://www.rememberthemilk.com/img/hp_steve_2.png?1587967172'
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3>You Made The List!</h3>
                    <p>You'll never forget who or what is on your list again.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={5000}>
                <img
                    id="image-3"
                    src='https://www.rememberthemilk.com/img/hp_steve_3.png?1587967172'
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h3>Get your tasks done.</h3>
                    <p>Search your lists and set due dates to get things done faster.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={5000}>
                <img
                    src='https://www.rememberthemilk.com/img/hp_steve_1.png?1587967172'
                    alt="Third slide"
                />
                <Carousel.Caption>
                    <h3>Get lists out of your head.</h3>
                    <p>Stop thinking about your lists, and let the app remember for you.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}

export default CarouselContainer;

  //test

