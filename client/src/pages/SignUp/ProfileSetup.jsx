import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Input from "../../components/ui/Input";
import api from "../../api/api";

const accountPic = "/auth/accountPic.jpg";

const avatarIds = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6",
  "avatar7",
  "avatar8",
];

export const getAvatarUrl = (avatarId) => `/avatars/${avatarId}.svg`;

function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [fullName, setFullName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarIds[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    if (!userId) {
      navigate("/signup");
    }
  }, [userId, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.put("/auth/profile", {
        userId,
        fullName,
        avatarUrl: selectedAvatar, // Saves just "avatar1", "avatar2", etc.
      });

      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/signin");
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

        <div className="mt-8 sm:mt-12">
          <label className="font-poppins font-medium text-sm sm:text-base md:text-lg block mb-4">
            Choose an Avatar
          </label>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {avatarIds.map((avatarId, index) => (
              <button
                key={index}
                onClick={() => setSelectedAvatar(avatarId)}
                className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all duration-300 hover:scale-105 ${
                  selectedAvatar === avatarId
                    ? "border-primary shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={getAvatarUrl(avatarId)}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover bg-gray-100"
                />
                {selectedAvatar === avatarId && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-8 h-8 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
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
