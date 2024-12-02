import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import caresoul1 from '../../images/bg-img/r4.jpg'
import caresoul2 from '../../images/bg-img/r6.jpg'
import caresoul3 from '../../images/caresoul/caresoul3.jpg'



const CarouselComponent: React.FC = () => {
    return (
        <div className='p-7'>
        <Carousel showThumbs={false} autoPlay interval={3000} infiniteLoop>
            <div className="carousel-slide ">
                <img src={caresoul1} alt="Delicious Homemade Burger" />
            </div>
            <div className="carousel-slide">
                <img src={caresoul2} alt="Another Dish" />
            </div>

            <div className="carousel-slide">
                <img src={caresoul3} alt="Another Dish" />
            </div>
        </Carousel>
        </div>
    );
};

export default CarouselComponent;
