import Button1 from "../components/button1"
import Logo from "../components/logo"
import ShowTag from "../components/showTag"
import ShowPic1 from "../assets/showPic1.png"
import ShowPic2 from "../assets/showPic2.png"
import ShowPic3 from "../assets/showPic3.png"
import ShowPic4 from "../assets/showPic4.png"
function LandingPage() {
    return (
        <div className="min-h-screen px-20 bg-[#f9f6e8]">
            <div className="header h-[14vh] flex flex-row justify-between">
                <Logo className=""></Logo>
                <div className="accountButton h-[100%] flex flex-row justify-center items-center">
                    <Button1 className="w-28">Login</Button1>
                    <Button1 className="w-28">Sign up</Button1>
                </div>
            </div>
            <div className="banner h-screen flex flex-row items-center pt-20">
                <div className="text flex flex-col w-1/2 ">
                    <div className="boldText  w-[100%] text-[4.8rem] font-bold font-poppins text-justify">
                        Every meal tells
                    </div>
                    <div className="boldText  w-[100%] text-[4.8rem] font-bold font-poppins flex flex-row items-center">
                        a memory
                        <img style={{ filter: "drop-shadow(5px 5px 10px rgba(0,0,0,0.5))" }} className="h-[180px]" src="./smallPic.png" alt="" />
                    </div>
                    <p className="smallText flex-1 w-[100%] text-justify font-inter text-2xl">
                        Cooking is more than just preparing food — it is a way of keeping memories alive. Every recipe carries a story, whether it is a dish passed down through generations or something new you discovered yesterday. With our platform, you can safely store, organize, and revisit all your favorite recipes anytime. No matter where you are, your kitchen memories will always be within reach, ready to inspire your next meal. This space is designed to celebrate tradition, creativity, and the joy of sharing food with the people you love.
                    </p>
                </div>
                <div className="bannerImg w-1/2 flex items-center justify-center">
                    <img style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }} className="w-5/6" src="./LandingPagePic1.png" alt="" />
                </div>
            </div>
            <div className="detailShow h-[50vh]  flex flex-row justify-between mt-28">
                <ShowTag url={ShowPic1} children="Homemade Taste, Crafted with Love"
                    description="Freshly made dishes that warm the heart and please the soul." />
                <ShowTag url={ShowPic2} children="Preserve Your Culinary Memories"
                    description="Simple ingredients, beautifully prepared for your daily joy." />
                <ShowTag url={ShowPic3} children="Simple Tools for Every Cook"
                    description="Inspired by home cooking, perfected with a modern touch." />
                <ShowTag url={ShowPic4} children="From Generations to Your Kitchen"
                    description="Created with care, turning simple meals into memories." />
            </div>
            <div className="sampleReview h-screen flex flex-row items-center pt-20">
                <div className="bannerImg w-1/2 flex items-center justify-center">
                    <img style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }} className="w-5/6" src="./LandingPagePic2.png" alt="" />
                </div>
                <div className="text h-[100%] flex flex-col w-1/2">
                    <div className="boldText  w-[100%] text-[4.8rem] font-bold font-poppins text-justify">
                        Create your
                    </div>
                    <div className="boldText  w-[100%] text-[4.8rem] font-bold font-poppins flex flex-row items-center">
                        own recipe
                    </div>
                    <p className="smallText flex-1 w-[100%] text-justify font-inter text-2xl">
                        Cooking is more than just preparing food — it is a way of keeping memories alive. Every recipe carries a story, whether it is a dish passed down through generations or something new you discovered yesterday. With our platform, you can safely store, organize, and revisit all your favorite recipes anytime. No matter where you are, your kitchen memories will always be within reach, ready to inspire your next meal. This space is designed to celebrate tradition, creativity, and the joy of sharing food with the people you love.
                    </p>
                </div>
            </div>
            <div className="mt-20 pageInfo border-t-[1px] border-t-[#9ca3af] h-[10vh] flex flex-row items-center justify-between">
                <div className="flex flex-row w-[10%] justify-between">
                    <div className="font-poppins text-[#9ca3af]">About</div>
                    <div className="font-poppins text-[#9ca3af]">Term</div>
                </div>
                <div className="font-poppins text-[#9ca3af]">Granny's Secret ©</div>
            </div>
        </div>
    )
}
export default LandingPage