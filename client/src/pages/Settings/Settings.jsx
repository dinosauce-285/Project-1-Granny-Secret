import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import api from "../../api/api";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "general", label: "General", icon: <UserIcon /> },
    { id: "password", label: "Password", icon: <LockIcon /> },
    { id: "notifications", label: "Notifications", icon: <BellIcon /> },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 w-full max-w-6xl mx-auto">
      <aside className="w-full md:w-64 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6 text-text-main">Settings</h1>
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            Loading...
          </div>
        ) : (
          <>
            {activeTab === "general" && <GeneralSettings user={currentUser} />}
            {activeTab === "password" && <PasswordSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
          </>
        )}
      </main>
    </div>
  );
}

function GeneralSettings({ user }) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-6 appear-animation">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-text-main">General Settings</h2>
        <p className="text-text-secondary text-sm mt-1">
          Manage your account information
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative group cursor-pointer">
          <img
            src={
              user?.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                user?.username || "Felix"
              }`
            }
            alt="avatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium">Change</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-main">
            {user?.fullName || user?.username}
          </h3>
          <p className="text-sm text-text-secondary mb-3">{user?.email}</p>
          <button className="text-primary font-medium text-sm hover:underline">
            Upload new picture
          </button>
          <p className="text-xs text-text-secondary mt-1">
            JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text-main mb-1 block">
            Full Name
          </label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-text-main mb-1 block">
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            readOnly
            className="bg-gray-50 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-text-main mb-1 block">
            Email
          </label>
          <Input
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            readOnly
            className="bg-gray-50 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <ButtonPrimary className="flex items-center justify-center text-white py-2.5 sm:py-3 text-sm sm:text-base bg-primary px-5 transition-all duration-300 hover:scale-105 hover:shadow-lg border-none whitespace-nowrap">
          Save Changes
        </ButtonPrimary>
      </div>
    </div>
  );
}

function PasswordSettings() {
  return (
    <div className="space-y-6 appear-animation">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-text-main">
          Password & Security
        </h2>
        <p className="text-text-secondary text-sm mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-medium text-text-main mb-1 block">
            Current Password
          </label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div>
          <label className="text-sm font-medium text-text-main mb-1 block">
            New Password
          </label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div>
          <label className="text-sm font-medium text-text-main mb-1 block">
            Confirm New Password
          </label>
          <Input type="password" placeholder="••••••••" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <ButtonPrimary className="flex items-center justify-center text-white py-2.5 sm:py-3 text-sm sm:text-base bg-primary px-5 transition-all duration-300 hover:scale-105 hover:shadow-lg border-none whitespace-nowrap">
          Update Password
        </ButtonPrimary>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6 appear-animation">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-text-main">Notifications</h2>
        <p className="text-text-secondary text-sm mt-1">
          Choose how you want to be notified
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-text-main">
              Email Notifications
            </h3>
            <p className="text-sm text-text-secondary">
              Receive emails about your account activity
            </p>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 accent-primary cursor-pointer"
            defaultChecked
          />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-text-main">
              New Recipe Alerts
            </h3>
            <p className="text-sm text-text-secondary">
              Get notified when someone posts a new recipe
            </p>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 accent-primary cursor-pointer"
            defaultChecked
          />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-text-main">
              Marketing Emails
            </h3>
            <p className="text-sm text-text-secondary">
              Receive offers and updates from our team
            </p>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <ButtonPrimary className="flex items-center justify-center text-white py-2.5 sm:py-3 text-sm sm:text-base bg-primary px-5 transition-all duration-300 hover:scale-105 hover:shadow-lg border-none whitespace-nowrap">
          Save Preferences
        </ButtonPrimary>
      </div>
    </div>
  );
}

export default Settings;
