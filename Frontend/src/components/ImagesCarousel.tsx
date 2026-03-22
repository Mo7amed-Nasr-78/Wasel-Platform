import React, { useState } from "react";
import type { ReactNode } from "react";

interface CarouselProps {
    children: ReactNode[],
    autoPlay?: boolean,
    interval?: number,
}

const ImagesCarousel: React.FC<CarouselProps> = ({ children, autoPlay = false, interval = 3000 }) => {

    const [ currentIndex, setCurrentIndex ] = useState(0);
    const slides = React.Children.toArray(children);
    
    const handleClick = (index: number): void => {
        setCurrentIndex(index);
    }

    React.useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % slides.length), interval);
        return () => clearInterval(timer);
    }, [])

    return (
        <div className={`relative w-full h-full max-w-4xl mx-auto overflow-hidden`}>
            <div 
                className="h-full flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${ currentIndex * 100 }%)` }}
            >
                {
                    slides.map((slide,index) => (
                        <div key={index} className="w-full shrink-0">
                            {slide}
                        </div>
                    ))
                }
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                {
                    slides.map((_, index) => (
                        <div key={index} onClick={() => handleClick(index)} className={`${currentIndex === index? "w-6 bg-(--primary-color)": "w-3 bg-(--secondary-color)"} h-3 rounded-full transition-transform duration-300 hover:scale-90 cursor-pointer`}></div>
                    ))
                }
            </div>
        </div>
    )
}


export default ImagesCarousel;