import { createPortal } from "react-dom";
import { useState } from "react";
import {
  LuX,
  LuCopy,
  LuFacebook,
  LuTwitter,
  LuLinkedin,
  LuCheck,
} from "react-icons/lu";

function ShareDialog({ isOpen, onClose, url, title }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(title)}`,
      "_blank",
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,
      "_blank",
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Recipe</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <LuX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex justify-around gap-4 mb-8">
          <button
            onClick={shareFacebook}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuFacebook className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs text-gray-600 font-medium">Facebook</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuTwitter className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs text-gray-600 font-medium">Twitter</span>
          </button>

          <button
            onClick={shareLinkedin}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuLinkedin className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs text-gray-600 font-medium">LinkedIn</span>
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">
            Page Link
          </label>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 pr-2">
            <span className="text-sm text-gray-600 truncate flex-1 px-2 select-all">
              {url}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                copied
                  ? "bg-green-500 text-white shadow-md transform scale-105"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {copied ? (
                <>
                  <LuCheck className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <LuCopy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>,
    document.body,
  );
}

export default ShareDialog;
