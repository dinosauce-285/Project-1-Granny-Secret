import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";
import api from "../../api/api";
import { z } from "zod";

const accountPic = "/auth/accountPic.jpg";

const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const result = ForgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      setEmailSent(true);
      setToastMessage("Password reset link has been sent to your email!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      // Backend always returns success for security reasons
      setEmailSent(true);
      setToastMessage(
        "If the email exists, a password reset link has been sent",
      );
      setToastType("success");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
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
            Forgot Your Password?
          </div>
          <div className="font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mt-3 sm:mt-4">
            {emailSent
              ? "Check your email for reset instructions"
              : "No worries! Enter your email and we'll send you reset instructions."}
          </div>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <div className="inputField mt-8 sm:mt-12 lg:mt-16 mx-auto w-full lg:mx-0">
              <label
                htmlFor="email"
                className="font-poppins font-medium text-sm sm:text-base md:text-lg"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: null }));
                  }
                }}
                onKeyPress={handleKeyPress}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>

            <ButtonPrimary
              type="submit"
              disabled={loading}
              className="hover:bg-primary-hover text-white py-2.5 sm:py-3 bg-primary mt-4 sm:mt-6 text-sm sm:text-base w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </ButtonPrimary>
          </form>
        ) : (
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-600 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-poppins text-green-800 font-medium">
                    Email sent successfully!
                  </p>
                  <p className="font-poppins text-green-700 text-sm mt-1">
                    If an account exists with <strong>{email}</strong>, you will
                    receive a password reset link shortly. Please check your
                    inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <ButtonPrimary
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="text-white py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-700 mt-4 text-sm sm:text-base w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none"
            >
              Try Another Email
            </ButtonPrimary>
          </div>
        )}

        <div className="toSignIn font-poppins mt-6 sm:mt-8 font-medium flex justify-center items-center flex-wrap gap-2 text-sm sm:text-base">
          <span>Remember your password?</span>
          <Link
            className="text-blue-700 underline underline-offset-2"
            to="/signin"
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

      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default ForgotPassword;
