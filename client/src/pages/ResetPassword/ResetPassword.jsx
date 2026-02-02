import AOS from "aos";
import "aos/dist/aos.css";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Input from "../../components/ui/Input";
import Toast from "../../components/ui/Toast";
import api from "../../api/api";
import { z } from "zod";
import { LuEye, LuEyeOff } from "react-icons/lu";

const accountPic = "/auth/accountPic.jpg";

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    if (!token) {
      setToastMessage("Invalid reset link");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [token, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const result = ResetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: formData.newPassword,
      });

      setToastMessage("Password reset successfully! Redirecting to login...");
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setToastMessage(message);
      setToastType("error");
      setShowToast(true);

      if (message.includes("expired") || message.includes("Invalid")) {
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      }
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
            Reset Your Password
          </div>
          <div className="font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mt-3 sm:mt-4">
            Enter your new password below
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="inputField mt-8 sm:mt-12 lg:mt-16 mx-auto w-full lg:mx-0">
            <label
              htmlFor="newPassword"
              className="font-poppins font-medium text-sm sm:text-base md:text-lg"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                className="pr-10 !mt-0"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword[0]}
              </p>
            )}

            <label
              htmlFor="confirmPassword"
              className="block font-poppins font-medium text-sm sm:text-base md:text-lg mt-6 sm:mt-8"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className="pr-10 !mt-0"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <ButtonPrimary
            type="submit"
            disabled={loading}
            className="hover:bg-primary-hover text-white py-2.5 sm:py-3 bg-primary mt-4 sm:mt-6 text-sm sm:text-base w-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-none disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </ButtonPrimary>
        </form>

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

export default ResetPassword;
