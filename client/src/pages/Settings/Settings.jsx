import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../api/user.api";
import { LuCamera } from "react-icons/lu";

function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await getUserProfile(currentUser.id);
        const data = res.data;
        setUser(data);
        setFormData({
          fullName: data.fullName || "",
          username: data.username || "",
        });
        setAvatarPreview(data.avatarUrl);
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser?.id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("username", formData.username);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await updateUserProfile(data);
      const updatedUser = res.data;

      const newUserState = { ...currentUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserState));

      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div
                className="relative group cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-primary/20 transition-all">
                  <img
                    src={avatarPreview || "/avatars/sampleAvatar.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <LuCamera className="w-8 h-8 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  Click on the image to upload a new one. <br />
                  JPG, GIF or PNG. Max size of 800K.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">@</span>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Unique username for your profile URL.
                </p>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all font-medium"
              >
                {saving ? <>Saving...</> : <>Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
