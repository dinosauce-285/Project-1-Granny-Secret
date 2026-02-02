import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from "../../api/user.api";
import { getPreferences, updatePreferences } from "../../api/preference.api";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Toast from "../../components/ui/Toast";
import Dialog from "../../components/ui/Dialog";
import {
  LuCamera,
  LuUser,
  LuLock,
  LuBell,
  LuShield,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";

function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentType, setShowCurrentType] = useState(false);
  const [showNewType, setShowNewType] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [notificationPreferences, setNotificationPreferences] = useState({
    notifyOnLike: true,
    notifyOnFollow: true,
    notifyOnComment: true,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await getMe();
        const data = res.data;
        setUser(data);
        setProfileData({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    console.log("notificationPreferences updated:", notificationPreferences);
  }, [notificationPreferences]);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (activeTab === "notifications") {
        try {
          const prefsRes = await getPreferences();
          console.log("Fetched preferences on tab switch:", prefsRes);
          if (prefsRes) {
            setNotificationPreferences({
              notifyOnLike: prefsRes.notifyOnLike ?? true,
              notifyOnFollow: prefsRes.notifyOnFollow ?? true,
              notifyOnComment: prefsRes.notifyOnComment ?? true,
            });
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      }
    };

    fetchPreferences();
  }, [activeTab]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const data = new FormData();
      data.append("fullName", profileData.fullName);
      data.append("username", profileData.username);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await updateUserProfile(data);

      let updatedUser = res;
      if (
        res &&
        res.data &&
        (res.success || Object.keys(res).includes("data"))
      ) {
        updatedUser = res.data;
      }

      const newUserState = { ...currentUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserState));
      setToastMessage("Profile updated successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastMessage(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }
    if (passwordData.newPassword.length < 6) {
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setToastMessage("Password changed successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handlePreferenceToggle = async (preference) => {
    const newValue = !notificationPreferences[preference];

    setNotificationPreferences((prev) => ({
      ...prev,
      [preference]: newValue,
    }));
    try {
      await updatePreferences({
        ...notificationPreferences,
        [preference]: newValue,
      });

      // Load preferences
      const prefsRes = await getPreferences();
      console.log("API Response from getPreferences():", prefsRes);
      if (prefsRes) {
        setNotificationPreferences({
          notifyOnLike: prefsRes.notifyOnLike ?? true,
          notifyOnFollow: prefsRes.notifyOnFollow ?? true,
          notifyOnComment: prefsRes.notifyOnComment ?? true,
        });
      }
      setToastMessage("Preference updated successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating preferences:", error);
      setNotificationPreferences((prev) => ({
        ...prev,
        [preference]: !newValue,
      }));
      setToastMessage(
        error.response?.data?.message ||
          "Failed to update preference. Please try again.",
      );
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setToastMessage("Please enter your password");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword);

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Close dialog and show success
      setShowDeleteDialog(false);
      setToastMessage("Account deleted successfully");
      setToastType("success");
      setShowToast(true);

      // Redirect to landing page after a short delay
      setTimeout(() => {
        navigate("/landing-page");
      }, 1500);
    } catch (error) {
      setDeleteLoading(false);
      setToastMessage(
        error.response?.data?.message ||
          "Failed to delete account. Please check your password.",
      );
      setToastType("error");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Edit Profile", icon: LuUser },
    { id: "account", label: "Account", icon: LuLock },
    { id: "notifications", label: "Notifications", icon: LuBell },
    { id: "security", label: "Privacy & Security", icon: LuShield },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              {activeTab === "profile" && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Edit Profile
                  </h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-8">
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
                        <h3 className="font-medium text-gray-900">
                          Profile Picture
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          Click on the image to upload a new one. <br />
                          JPG, GIF or PNG. Max size of 800K.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="py-2 text-gray-900 font-medium sm:text-sm">
                          {user?.email || ""}
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Username
                        </label>
                        <Input
                          type="text"
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                        />
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
                        <Input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <ButtonPrimary
                        type="submit"
                        disabled={profileSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        {profileSaving ? <>Saving...</> : <>Save Changes</>}
                      </ButtonPrimary>
                    </div>
                  </form>
                </>
              )}

              {activeTab === "account" && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentType ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="pr-10 !mt-0"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowCurrentType(!showCurrentType)}
                        >
                          {showCurrentType ? <LuEyeOff /> : <LuEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative flex items-center">
                        <Input
                          type={showNewType ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewType(!showNewType)}
                        >
                          {showNewType ? <LuEyeOff /> : <LuEye />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum 6 characters.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="flex justify-start pt-2">
                      <ButtonPrimary
                        type="submit"
                        disabled={passwordSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        {passwordSaving ? <>Saving...</> : <>Change Password</>}
                      </ButtonPrimary>
                    </div>
                  </form>
                </>
              )}

              {activeTab === "notifications" && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Like Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Get notified when someone likes your recipe.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationPreferences.notifyOnLike}
                          onChange={() =>
                            handlePreferenceToggle("notifyOnLike")
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Follow Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Get notified when someone follows you.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationPreferences.notifyOnFollow}
                          onChange={() =>
                            handlePreferenceToggle("notifyOnFollow")
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Comment Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Get notified when someone comments on your recipe.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationPreferences.notifyOnComment}
                          onChange={() =>
                            handlePreferenceToggle("notifyOnComment")
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "security" && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Privacy & Security
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Private Profile
                        </h3>
                        <p className="text-sm text-gray-500">
                          Only your followers can see your recipes.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        Data Management
                      </h3>
                      <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        Delete Account
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Permanently remove your account and all of your content.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletePassword("");
        }}
        title="Delete Account"
        confirmText={deleteLoading ? "Deleting..." : "Delete Account"}
        confirmStyle="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => {
          setShowDeleteDialog(false);
          setDeletePassword("");
        }}
        message="This action cannot be undone. All your recipes, comments, and data will be permanently deleted."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteAccount();
          }}
        >
          <Input
            id="delete-password"
            label="Enter your password to confirm"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
        </form>
      </Dialog>

      <Toast
        isOpen={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Settings;
