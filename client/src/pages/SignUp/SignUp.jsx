import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Input from "../../components/ui/Input";
import api from "../../api/api";
import { RegisterSchema } from "../../schemas/auth.schema";

const accountPic = "/auth/accountPic.jpg";
const logoGoogle = "/auth/logoGoogle.png";
const logoFacebook = "/auth/logoFacebook.png";

function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
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
    const result = RegisterSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      navigate("/profile-setup", {
        state: { userId: response.data.data.id, from: location.state?.from },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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
            Get Started Now
          </div>
          <div className="font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mt-3 sm:mt-4">
            Join us to collect and share your best dishes.
          </div>
        </div>

        {errors.general && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="inputField mt-8 sm:mt-12 lg:mt-16 mx-auto w-full lg:mx-0">
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

          <label
            htmlFor="name"
            className="mt-6 sm:mt-8 block font-poppins font-medium text-sm sm:text-base md:text-lg"
          >
            Username
          </label>
          <Input
            id="name"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
          )}

          <label
            htmlFor="password"
            className="mt-6 sm:mt-8 block font-poppins font-medium text-sm sm:text-base md:text-lg"
          >
            Password
          </label>
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

          <label
            htmlFor="repass"
            className="mt-6 sm:mt-8 block font-poppins font-medium text-sm sm:text-base md:text-lg"
          >
            Confirm Password
          </label>
          <Input
            id="repass"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <ButtonPrimary
          onClick={handleSubmit}
          disabled={loading}
          className="hover:bg-primary-hover text-white py-2.5 sm:py-3 bg-primary mt-4 sm:mt-6 text-sm sm:text-base w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </ButtonPrimary>

        <div className="divider flex items-center mt-6 sm:mt-8 md:mt-12">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-poppins">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="methods mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <ButtonPrimary className="flex items-center justify-center text-black py-2.5 sm:py-3 text-sm sm:text-base bg-white w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
            <img
              className="h-5 w-5 object-contain mr-2"
              src={logoGoogle}
              alt=""
            />
            Sign up with Google
          </ButtonPrimary>
          <ButtonPrimary className="flex items-center justify-center text-black py-2.5 sm:py-3 text-sm sm:text-base bg-white w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none">
            <img
              className="h-5 w-5 object-contain mr-2"
              src={logoFacebook}
              alt=""
            />
            Sign up with Facebook
          </ButtonPrimary>
        </div>

        <div className="toSignUp font-poppins mt-6 sm:mt-8 lg:mt-10 font-medium flex justify-center items-center flex-wrap gap-2 text-sm sm:text-base">
          <span>Already have an account?</span>
          <Link
            className="text-blue-700 underline underline-offset-2"
            to="/signin"
            state={{ from: location.state?.from }}
          >
            Sign In
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

export default SignUp;
