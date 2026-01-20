import { useState, useEffect } from "react";
import { LuCloudUpload } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Input from "../../components/ui/Input";
import api from "../../api/api";

const accountPic = "/auth/accountPic.jpg";

function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [customAvatarFile, setCustomAvatarFile] = useState(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    if (!userId) {
      navigate("/signup");
    }
  }, [userId, navigate]);

  const handleCustomAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPG, PNG, or WEBP)");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        return;
      }

      setError(null);
      setCustomAvatarFile(file);
      setCustomAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("fullName", fullName);

      if (customAvatarFile) {
        formData.append("avatar", customAvatarFile);
      }

      await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/signin", { state: { from: location.state?.from } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/signin", { state: { from: location.state?.from } });
  };

  return (
    <div className="min-h-screen flex bg-page">
      <div
        data-aos="fade-right"
        className="halfLeft min-h-screen w-full lg:w-1/2 px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:flex lg:flex-col lg:justify-center"
      >
        <div className="welcomeBack">
          <div className="font-poppins font-semibold text-2xl sm:text-3xl md:text-4xl xl:text-5xl leading-tight">
            Complete Your Profile
          </div>
          <div className="font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl mt-3 sm:mt-4 text-gray-600">
            Add a profile picture and your name to personalize your account.
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-8 sm:mt-12 flex justify-center">
          <input
            type="file"
            id="customAvatar"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleCustomAvatarChange}
          />

          <label htmlFor="customAvatar" className="block cursor-pointer group">
            {customAvatarPreview ? (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary shadow-lg transition-all duration-300 hover:scale-105">
                <img
                  src={customAvatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium text-sm">Change</span>
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-dashed border-gray-300 hover:border-primary transition-all duration-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
                <LuCloudUpload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  Upload
                </span>
                <span className="text-xs text-gray-500">Photo</span>
              </div>
            )}
          </label>
        </div>

        <div className="mt-8">
          <label
            htmlFor="fullName"
            className="font-poppins font-medium text-sm sm:text-base md:text-lg"
          >
            Full Name (Optional)
          </label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="mt-8 flex gap-4">
          <ButtonPrimary
            onClick={handleSubmit}
            disabled={loading}
            className="hover:bg-primary-hover text-white py-2.5 sm:py-3 bg-primary text-sm sm:text-base flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg border-none disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </ButtonPrimary>
          <ButtonPrimary
            onClick={handleSkip}
            className="text-gray-600 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-sm sm:text-base px-6 transition-all duration-300 border-none"
          >
            Skip
          </ButtonPrimary>
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

export default ProfileSetup;
