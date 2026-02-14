import Image from "next/image";
import Landing_2 from '@/public/images/Landing_2.webp'

export default function Introduction2() {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="1700px:h-[100px] h-[40px] w-full"></div>
            <div className="flex flex-row justify-center w-[85%]">
                <div className="relative h-[377px] w-[15%] 1700px:block hidden">
                    <div className="absolute font-playfairDisplay text-[20px] text-[#ADADAD] origin-top-left rotate-90 text-nowrap left-[60%]">Expertly sourced for your peace of mind.</div>
                </div>
                <div className="1700px:w-[85%] w-full">
                    <Image src={Landing_2} alt="Landing_2" className="w-full aspect-[4/1] object-cover 500px:block hidden" />
                    <div className="flex 750px:flex-row flex-col w-full 1300px:aspect-[7/1] 1100px:aspect-[6/1] 750px:aspect-[4/1] 500px:aspect-[3/1] justify-center">
                        <div className="1300px:w-2/5 750px:w-1/2 750px:my-0 300px:my-5 w-full text-balance flex items-center font-playfairDisplay 1300px:text-[40px] text-[32px] mr-10 text-balance">The Difference is in the Details and the Roots.</div>
                        <div className="1300px:w-3/5 750px:w-1/2 w-full text-balance flex items-center font-playfairDisplay 1300px:text-[16px] text-[13px] text-[#ADADAD]">We believe every space deserves a touch of life. That’s why we source only the healthiest, most vibrant plants and provide you with simple, straightforward care guidance. From low-light corners to sun-drenched windows, find the perfect companion that is ready to thrive alongside you.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}