import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Input from "../../components/ui/Input";
import api from "../../api/api";
import { z } from "zod";

const accountPic = "/auth/accountPic.jpg";
const logoGoogle = "/auth/logoGoogle.png";
const logoFacebook = "/auth/logoFacebook.png";

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-page">
      <div
        data-aos="fade-right"
        className="halfLeft min-h-screen w-full lg:w-1/2
            px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:flex lg:flex-col lg:justify-center"
      >
        <div className="welcomeBack">
          <div className="font-poppins font-semibold text-2xl sm:text-3xl md:text-4xl xl:text-5xl leading-tight">
            Welcome back!
          </div>
          <div className="font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mt-3 sm:mt-4">
            Discover the joy of cooking with Granny's Secret!
          </div>
        </div>

        {errors.general && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="inputField mt-8 sm:mt-12 lg:mt-16  mx-auto w-full lg:mx-0">
          <label
            htmlFor="email"
            className="font-poppins font-medium text-sm sm:text-base md:text-lg"
          >
            Email address
          </label>
          <Input
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}

          <div className="flex items-center justify-between mt-6 sm:mt-8">
            <label
              htmlFor="password"
              className="block font-poppins font-medium text-sm sm:text-base md:text-lg"
            >
              Password
            </label>
            <Link to="/forgot-password">
              <div className="font-poppins text-sm sm:text-base text-blue-600 hover:text-blue-800">
                Forgot password?
              </div>
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
          )}

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 font-poppins text-sm sm:text-base cursor-pointer"
            >
              Remember password
            </label>
          </div>
        </div>

        <ButtonPrimary
          onClick={handleSubmit}
          disabled={loading}
          className="hover:bg-primary-hover text-white py-2.5 sm:py-3 bg-primary mt-4 sm:mt-6 text-sm sm:text-base w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </ButtonPrimary>

        <div className="divider flex items-center mt-6 sm:mt-8 md:mt-12">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-poppins">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="methods mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <ButtonPrimary className=" flex items-center justify-center text-black py-2.5 sm:py-3 text-sm sm:text-base bg-white w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
            <img
              className="h-5 w-5 object-contain mr-2"
              src={logoGoogle}
              alt=""
            />
            Sign in with Google
          </ButtonPrimary>
          <ButtonPrimary className=" flex items-center justify-center text-black py-2.5 sm:py-3 text-sm sm:text-base bg-white w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
            <img
              className="h-5 w-5 object-contain mr-2"
              src={logoFacebook}
              alt=""
            />
            Sign in with Facebook
          </ButtonPrimary>
        </div>

        <div className="toSignUp font-poppins mt-6 sm:mt-8 lg:mt-10 font-medium flex justify-center items-center flex-wrap gap-2 text-sm sm:text-base">
          <span>Don't have an account?</span>
          <Link
            className="text-blue-700 underline underline-offset-2"
            to="/signup"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div data-aos="fade-left" className="halfRight hidden lg:block lg:w-1/2">
        <img
          className="w-full h-full object-cover rounded-tl-[2rem] rounded-bl-[2rem]"
          src={accountPic}
          alt=""
        />
      </div>
    </div>
  );
}

export default SignIn;
