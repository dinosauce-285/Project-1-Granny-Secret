import Button1 from "../components/button1"
import Logo from "../components/logo"
function LandingPage()
{
    return (
        <div className="min-h-screen">
            <div className="header h-[14vh] flex flex-row justify-between">
                <Logo className="ml-5"></Logo>
                <div className="accountButton mr-5 h-[100%] flex flex-row justify-center items-center">
                    <Button1 className="w-28">Login</Button1>
                    <Button1 className="w-28">Sign up</Button1>
                </div>
            </div>
            <div className="banner h-screen flex flex-row items-center mt-20 ml-5">
                <div className="text flex flex-col w-1/2 ">
                    <div className="boldText  w-[100%] text-[5.4rem] font-bold font-poppins text-justify">
                        Every meal tells  
                    </div>
                    <div className="boldText  w-[100%] text-[5.5rem] font-bold font-poppins">
                        a memory
                    </div>
                    <div className="smallText flex-1 w-[100%] text-justify font-inter text-2xl">
                        Cooking is more than just preparing food — it is a way of keeping memories alive. Every recipe carries a story, whether it is a dish passed down through generations or something new you discovered yesterday. With our platform, you can safely store, organize, and revisit all your favorite recipes anytime. No matter where you are, your kitchen memories will always be within reach, ready to inspire your next meal. This space is designed to celebrate tradition, creativity, and the joy of sharing food with the people you love.
                    </div>
                </div>
                <div className="bannerImg w-1/2">
                    <img src="./LandingPagePic1.png" alt="" />
                </div>
            </div>
            <div className="detailShow h-[60vh] bg-orange-500">
                
            </div>
            <div className="sampleReview h-screen flex flex-row bg-red-100">
                <div className="bannerImg w-1/2">
                    <img src="./LandingPagePic2.png" alt="" />
                </div>
                <div className="text h-[100%] flex flex-col w-1/2">
                    <div className="boldText h-[20%] bg-amber-500 w-[100%]"></div>
                    <div className="smallText flex-1 bg-green-500 w-[100%]"></div>
                </div>
            </div>
            <div className="pageInfo h-[20vh] bg-purple-400">
                 
            </div>
        </div>
    )
}
export default LandingPage