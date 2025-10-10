import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Button1 from "../components/button1"
import Logo from "../components/logo"
import ShowTag from "../components/showTag"
import ShowPic1 from "../assets/showPic1.png"
import ShowPic2 from "../assets/showPic2.png"
import ShowPic3 from "../assets/showPic3.png"
import ShowPic4 from "../assets/showPic4.png"


function LandingPage() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        })
    }, [])
    return (
        <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 bg-[#f9f6e8]">
            <div className="header h-[10vh] sm:h-[12vh] md:h-[14vh]  flex flex-row justify-between">
                <Logo className=""></Logo>
                <div className="accountButton flex flex-row justify-center items-center space-x-4">
                    <Button1 className="w-24 sm:w-28">Login</Button1>
                    <Button1 className="w-28">Sign up</Button1>
                </div>
            </div>
            <div className="wrapper mt-2 md:mt-5">
                <div data-aos="fade-up" className="banner min-h-[calc(100vh-10vh)] flex flex-col-reverse md:flex-row items-center pb-10 md:pb-0">
                    <div className="text flex flex-col w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
                        <div style={{ filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.5))" }} className="boldText flex text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold font-poppins leading-tight md:justify-start">
                            Every meal tells
                        </div>
                        <div style={{ filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.5))" }} className="boldText text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold font-poppins flex flex-row items-center md:justify-start">
                            a memory
                            <img style={{ filter: "drop-shadow(5px 5px 10px rgba(0,0,0,0.5))" }} className="h-16 sm:h-20 md:h-28 lg:h-[180px] ml-2 sm:ml-4" src="./smallPic.png" alt="" />
                        </div>
                        <p className="smallText w-full mt-4 text-base sm:text-lg md:text-xl lg:text-2xl font-inter text-justify">
                            Cooking is more than just preparing food — it is a way of keeping memories alive. Every recipe carries a story, whether it is a dish passed down through generations or something new you discovered yesterday. With our platform, you can safely store, organize, and revisit all your favorite recipes anytime. No matter where you are, your kitchen memories will always be within reach, ready to inspire your next meal. This space is designed to celebrate tradition, creativity, and the joy of sharing food with the people you love.
                        </p>
                    </div>
                    <div className="bannerImg w-full md:w-1/2 flex items-center justify-center">
                        <img style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }} className="w-5/6" src="./LandingPagePic1.png" alt="" />
                    </div>
                </div>
            </div>
            <div
                data-aos="fade-right"
                data-aos-easing="ease-out"
                className="detailShow min-h-[auto] md:min-h-[50vh] flex flex-wrap justify-center sm:justify-between gap-x-4 gap-y-8 mt-16 md:mt-28 mb-16">
                <ShowTag url={ShowPic1} children="Homemade Taste, Crafted with Love"
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.75rem)]"
                    description="Freshly made dishes that warm the heart and please the soul." />
                <ShowTag url={ShowPic2} children="Preserve Your Culinary Memories"
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.75rem)]"
                    description="Simple ingredients, beautifully prepared for your daily joy." />
                <ShowTag url={ShowPic3} children="Simple Tools for Every Cook"
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.75rem)]"
                    description="Inspired by home cooking, perfected with a modern touch." />
                <ShowTag url={ShowPic4} children="From Generations to Your Kitchen"
                    className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.75rem)]"
                    description="Created with care, turning simple meals into memories." />
            </div>
            <div data-aos="fade-up" className="sampleReview min-h-auto md:min-h-screen flex flex-col md:flex-row items-center pt-10 md:pt-20 pb-10 md:pb-0">
                <div className="bannerImg w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
                    <img style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }} className="w-5/6" src="./LandingPagePic2.png" alt="" />
                </div>
                <div className="text flex flex-col w-full md:w-1/2 text-center md:text-left">
                    <div className="boldText w-full text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold  font-poppins leading-tight flex md:justify-start">
                        Create your
                    </div>
                    <div className="boldText w-full text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold font-poppins flex md:justify-start">
                        own recipe
                    </div>
                    <p className="smallText w-full mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-justify font-inter text-2xl">
                        Cooking is more than just preparing food — it is a way of keeping memories alive. Every recipe carries a story, whether it is a dish passed down through generations or something new you discovered yesterday. With our platform, you can safely store, organize, and revisit all your favorite recipes anytime. No matter where you are, your kitchen memories will always be within reach, ready to inspire your next meal. This space is designed to celebrate tradition, creativity, and the joy of sharing food with the people you love.
                    </p>
                </div>
            </div>
            <div className="footer mt-16 md:mt-20 border-t-[1px] border-t-[#9ca3af] h-[auto] py-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                <div className="flex flex-row space-x-4 mb-4 sm:mb-0">
                    <div className="font-poppins text-[#9ca3af]  text-sm sm:text-base">About</div>
                    <div className="font-poppins text-[#9ca3af]  text-sm sm:text-base">Term</div>
                </div>
                <div className="font-poppins text-[#9ca3af]">Granny's Secret ©</div>
            </div>
        </div>
    )
}
export default LandingPage