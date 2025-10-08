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
            <div className="banner h-screen flex flex-row">
                <div className="text h-[100%] flex flex-col w-1/2">
                    <div className="boldText h-[20%] bg-amber-500 w-[100%]"></div>
                    <div className="smallText flex-1 bg-green-500 w-[100%]"></div>
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