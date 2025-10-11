import Input from "../../components/input"
import accountPic from "../../assets/accountPic.jpg"

function Login() {
    return (
        <div className="min-h-screen flex bg-[#f9f6e8]">
            <div className="halfLeft min-h-screen w-full sm:w-full lg:w-1/2
            px-4 sm:px-8 md:px-12 lg:px-20 py-12  sm:py-16 md:py-20">
                <div className="welcomeBack">
                    <div className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl"> Welcome back!</div>
                    <div className="font-semibold font-poppins text-base md:text-lg lg:text-xl mt-4">Enter your Credentials to access your account</div>
                </div>
                <div className="inputField h-[30%] mt-16">
                    <div className="font-poppins font-medium text-base md:text-lg lg:text-xl">Email address</div>
                    <Input placeholder="Enter your email"/>
                    <div className="mt-8 font-poppins font-medium text-base md:text-lg lg:text-xl">Password</div>
                    <Input placeholder="Enter your email"/>
                </div>
                <div className="button "></div>
                <div className="divsion"></div>
                <div className="methods"></div>
                <div className="toSignUp"></div>
            </div>
            <div className="halfRight hidden lg:block lg:w-1/2">
                <img className="w-full h-full object-cover rounded-tl-[2rem] rounded-bl-[2rem]" src={accountPic} alt="" />
            </div>
        </div>
    )
}
export default Login