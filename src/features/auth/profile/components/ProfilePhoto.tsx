import React, { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  deleteProfilePicture,
  getProfilePicture,
  uploadProfilePicture,
} from "../api/profileApi";
import { useMutation } from "@tanstack/react-query";
import { handleResponse } from "../../../../utils/handleErrors";

const ProfilePhoto = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dpUrl, setDpUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Load Profile Picture on Mount
  useEffect(() => {
    (async () => {
      const res = await getProfilePicture();
      if (res?.picture?.url) setDpUrl(res.picture.url);
    })();
  }, []);

  // ✅ Close Menu if click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (data) => {
      if (data?.picture?.url) {
        setDpUrl(data.picture.url);
        setPreview(null);
        handleResponse({
          successCondition: true,
          successMsg: data.message || "Profile photo updated ",
        });
      }
      setMenuOpen(false);
    },
    onError: (error) =>
      handleResponse({
        error,
      }),
  });

  // ✅ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: (data) => {
      setDpUrl(null);
      setPreview(null);
      handleResponse({
        successCondition: true,
        successMsg: data.message || "Photo deleted ",
      });
      setMenuOpen(false);
    },
    onError: (error) => handleResponse({ error }),
  });

  // ✅ Handle Select Upload File
  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="relative w-full">
      {/* Gradient Header Background */}
      <div className="w-full h-20 bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 dark:from-blue-950 dark:via-gray-800 dark:to-emerald-900 rounded-b-3xl shadow-sm" />

      {/* Profile Image */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-10 bottom-0 transform translate-y-1/2"
        ref={menuRef}
      >
        <div
          className="relative border-[1px] dark:border-white border-neutral-900 rounded-full cursor-pointer group"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {/* ✅ Placeholder Icon */}
          {!dpUrl && !preview && (
            <div
              className={`w-36 h-36 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center shadow-lg transition-transform duration-300 ${
                menuOpen ? "scale-105" : "group-hover:scale-105"
              }`}
            >
              <Camera className="w-12 h-12 text-gray-700 dark:text-gray-300" />
            </div>
          )}

          {/* ✅ Display Profile Image */}
          {(dpUrl || preview) && (
            <img
              src={preview || dpUrl!}
              alt="Profile"
              className={`w-36 h-36 rounded-full object-cover shadow-lg transition-transform duration-300 ${
                menuOpen ? "scale-105" : "group-hover:scale-105"
              }`}
            />
          )}

          {/* ✅ Loading Spinner */}
          {(uploadMutation.isPending || deleteMutation.isPending) && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
          )}
        </div>

        {/* ✅ Dropdown Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 p-3 
            bg-white dark:bg-gray-900 shadow-md rounded-xl w-44 
            flex flex-col gap-3 z-50"
          >
            {/* ✅ Upload */}
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg transition">
              <Camera className="w-5 h-5" />
              <span className="text-sm">Upload photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onSelectImage}
              />
            </label>

            {/* ✅ Delete */}
            {dpUrl && (
              <button
                onClick={() => deleteMutation.mutate()}
                className="flex items-center gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 text-red-600 p-2 rounded-lg text-sm transition"
              >
                <Trash2 className="w-5 h-5" />
                Delete photo
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePhoto;
