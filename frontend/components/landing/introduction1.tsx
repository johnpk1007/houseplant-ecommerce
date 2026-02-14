import Image from "next/image";
import Landing_1 from '@/public/images/Landing_1.webp'

export default function Introduction1() {
  return (
    <div className="w-full 1700px:h-[956px] h-[750px] flex flex-row">
      <div className="flex-1 500px:flex flex-row hidden">
        <div className="flex-1 relative items-center ml-10 970px:flex hidden">
          <div className="absolute h-full flex flex-col justify-center">
            <div className="flex flex-col 1700px:h-fit 970px:h-full justify-evenly 1700px:ml-0 1500px:ml-[50%]">
              <div className="flex 1700px:flex-row 970px:flex-col">
                <div className="font-vogue 1700px:text-[150px] 970px:text-[110px] text-[#B4E4DD] text-nowrap leading-none">
                  BRING
                </div>
                <div className="font-vogue 1700px:text-[150px] 970px:text-[110px] text-[#B4E4DD] text-nowrap leading-none 1700px:pl-[5%] 1500px:pl-[30%] 970px:pl-[10%]">
                  NATURE
                </div>
              </div>
              <div className="font-vogue 1700px:text-[150px] 970px:text-[110px] text-[#B4E4DD] leading-none 1700px:pl-[10%] 970px:pl-0">
                INDOORS
              </div>
            </div>
            <div className="1700px:block hidden">
              <div className="font-playfairDisplay text-[20px] text-[#ADADAD] text-balance">
                Find your natural rhythm with our
              </div>
              <div className="font-playfairDisplay text-[20px] text-[#ADADAD] text-balance">
                expertly curated collection of living arts
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex 1700px:justify-start 500px:justify-end">
          <Image src={Landing_1} alt="Landing_1" className="1700px:h-[956px] 1700px:w-[373px] 970px:w-[270px] 500px:h-[750px] 500px:w-[175px] object-cover" />
        </div>
      </div>
      <div className="flex-1 500px:flex items-center hidden">
        <div className="970px:w-[500px] 970px:h-[530px] 500px:h-full flex flex-col 1500px:ml-[20%] 970px:ml-[10%]">
          <div className="flex-col items-center mb-[10%] 970px:flex hidden">
            <div className="font-playfairDisplay 1700px:text-[40px] 970px:text-[32px] text-nowrap">The Art of Slow Living,</div>
            <div className="font-playfairDisplay 1700px:text-[40px] 970px:text-[32px] w-fit">Right at Home.</div>
          </div>
          <div className="flex 970px:flex-row 500px:flex-col h-full">
            <div className="970px:flex-1 flex flex-col 970px:h-auto 500px:h-3/5">
              <div className="500px:mx-5 500px:mb-6 970px:text-[16px] 500px:text-[13px] text-[#ADADAD] 970px:h-auto 500px:h-1/3 970px:block 500px:flex 500px:items-center 970px:w-auto 750px:w-1/2 500px:w-auto">
                Slow living begins within the spaces we return to each day. By welcoming houseplants indoors, the home becomes calmer and more intentional, grounded in the quiet presence of nature.
              </div>
              <div className="970px:hidden relative 500px:h-1/3">
                <div className="absolute flex flex-col h-full 750px:-left-[80%] 500px:-left-[90%] 750px:-top-[20%] 500px:top-0">
                  <div className="font-vogue 750px:text-[96px] 500px:text-[70px] text-[#B4E4DD] text-nowrap leading-none">
                    BRING NATURE
                  </div>
                  <div className="font-vogue 750px:text-[96px] 500px:text-[70px] text-[#B4E4DD] leading-none 500px:pl-[10%]">
                    INDOORS
                  </div>
                </div>
              </div>
              <div className="500px:mx-5 970px:text-[16px] 500px:text-[13px] text-[#ADADAD] 970px:h-auto 500px:h-1/3 970px:block 500px:flex 500px:items-center 970px:w-auto 750px:w-1/2 500px:w-auto">
                As plants take root, so do slower rhythms. The simple acts of watering, adjusting light, and observing new growth invite moments of care and attention, turning routine into ritual.
              </div>
            </div>
            <div className="970px:hidden h-1/5 relative">
              <div className="absolute 750px:-left-[30%] 500px:-left-[40%] bg-white border-x-15 border-y-5 border-white">
                <div className="font-playfairDisplay text-[32px] text-nowrap">The Art of Slow Living,</div>
                <div className="font-playfairDisplay text-[32px]">Right at Home.</div>
              </div>
            </div>
            <div className="970px:flex-1 flex 970px:flex-col 500px:flex-row 970px:h-auto 500px:h-1/5 relative">
              <div className="500px:mx-3 500px:mx-5 500px:mb-6 970px:text-[16px] 500px:text-[13px] text-[#ADADAD] 500px:absolute 970px:relative 970px:left-0 500px:-left-[83%] 970px:top-0 500px:-top-[35%] 970px:w-auto 750px:w-1/2 500px:w-2/3 bg-white border-10 border-white">
                Gradually, these rituals shape the atmosphere. Greenery softens light, enriches texture, and brings a sense of balance that flows naturally from room to room.
              </div>
              <div className="970px:block 500px:flex justify-end 500px:border-r-50 970px:border-r-0 500px:border-t-50 970px:border-t-0 border-white">
                <div className="970px:mx-5 970px:text-[16px] 500px:text-[13px] text-[#ADADAD] 970px:h-auto 500px:h-1/2 970px:w-auto 750px:w-1/3 500px:w-3/4">
                  With time, plants and people grow together, making slow living a natural part of home.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="500px:hidden flex bg-[url(/images/Landing_1.webp)] w-full h-full bg-cover bg-center flex flex-col">
        <div className="flex flex-col w-full border-x-20 border-transparent mt-auto mb-auto">
          <div className="font-vogue text-[70px] text-white leading-none self-start border-l-10 border-transparent">
            BRING
          </div>
          <div className="font-vogue text-[70px] text-white leading-none self-end">
            NATURE
          </div>
          <div className="font-vogue text-[70px] text-white leading-none self-end border-r-20 border-transparent">
            INDOORS
          </div>
        </div>
        <div className="self-end mb-10 mr-10">
          <div className="font-playfairDisplay text-[32px] text-white text-nowrap text-right">The Art of Slow Living,</div>
          <div className="font-playfairDisplay text-[32px] text-white text-right">Right at Home.</div>
          <div className="font-playfairDisplay text-[13px] text-white text-right">
            radually, these rituals shape the atmosphere. Greenery softens light, enriches texture, and brings a sense of balance that flows naturally from room to room
          </div>
        </div>
      </div>
    </div>
  );
}
