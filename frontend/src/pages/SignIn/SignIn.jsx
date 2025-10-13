import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom"
import Input from "../../components/input"
import Button1 from "../../components/button1"
import accountPic from "../../assets/accountPic.jpg"
import logoGoogle from "../../assets/logoGoogle.png"
import logoFacebook from "../../assets/logoFacebook.png"


function SignIn() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        })
    }, [])
    return (
        <div className="min-h-screen flex bg-[#f9f6e8]">
            <div data-aos="fade-right" className="halfLeft min-h-screen w-full lg:w-1/2
            px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:flex lg:flex-col lg:justify-center">
                <div className="welcomeBack">
                    <div className="font-poppins font-semibold text-2xl sm:text-3xl md:text-4xl xl:text-5xl leading-tight"> Welcome back!</div>
                    <div className="font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mt-3 sm:mt-4">Discover the joy of cooking with Granny’s Secret!</div>
                </div>
                <div className="inputField mt-8 sm:mt-12 lg:mt-16  mx-auto w-full lg:mx-0">
                    <label htmlFor="email" className="font-poppins font-medium text-sm sm:text-base md:text-lg">
                        Email address
                    </label>
                    <Input id="email" placeholder="Enter your email" />
                    <label htmlFor="password" className="mt-6 sm:mt-8 block font-poppins font-medium text-sm sm:text-base md:text-lg">
                        Password
                    </label>
                    <Input id="password" placeholder="Enter your password" />
                    <div className="flex items-center mt-6">
                        <input type="checkbox" id="remember" className="w-4 h-4 cursor-pointer" />
                        <label htmlFor="remember" className="ml-2 font-poppins text-sm sm:text-base cursor-pointer">
                            Remember password
                        </label>
                    </div>
                </div>
                <Button1 className="hover:bg-[#007a00] text-white py-2.5 sm:py-3 bg-[#006400] mt-4 sm:mt-6 text-sm sm:text-base w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">Sign In</Button1>
                <div className="divider flex items-center mt-6 sm:mt-8 md:mt-12">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 font-poppins">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="methods mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button1 className=" flex items-center justify-center text-black py-2.5 sm:py-3 text-sm sm:text-base bg-white w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
                        <img className="h-5 w-5 object-contain mr-2" src={logoGoogle} alt="" />
                        Sign in with Google
                    </Button1>
                    <Button1 className=" flex items-center justify-center text-black py-2.5 sm:py-3 text-sm sm:text-base bg-white w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
                        <img className="h-5 w-5 object-contain mr-2" src={logoFacebook} alt="" />
                        Sign in with Facebook
                    </Button1>
                </div>
                <div className="toSignUp font-poppins mt-6 sm:mt-8 lg:mt-10 font-medium flex justify-center items-center flex-wrap gap-2 text-sm sm:text-base">
                    <span>Don't have an account?</span>
                    <Link className="text-blue-700 underline underline-offset-2" to="/signup">Sign Up</Link>
                </div>
            </div>
            <div data-aos="fade-left" className="halfRight hidden lg:block lg:w-1/2">
                <img className="w-full h-full object-cover rounded-tl-[2rem] rounded-bl-[2rem]" src={accountPic} alt="" />
            </div>
        </div>
    )
}
export default SignIn