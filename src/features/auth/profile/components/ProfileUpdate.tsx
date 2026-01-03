import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../api/profileApi";
import { handleResponse } from "../../../../utils/handleErrors";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import LoadingError from "../../../../components/errors/LoadingError";
import { LoaderCircleIcon } from "lucide-react";
import type { UserProfileForm, UserProfileResponse } from "../types/Profile";


const ProfileSettings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<UserProfileResponse>({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const [formData, setFormData] = useState<UserProfileForm>({
    name: "",
    email: "",
    bio: "",
  });

  // ✅ Set form data once profile is fetched
  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        bio: data.user.bio || "",
      });
    }
  }, [data]);

  const updateProfile = useMutation<
    { message: string },
    unknown,
    UserProfileForm
  >({
    mutationFn: (data: UserProfileForm) =>
      updateUserProfile(data) as Promise<{ message: string }>,
    onSuccess: (res) => {
      handleResponse({
        successCondition: true,
        successMsg: res.message || "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: unknown) => handleResponse({ error }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        <LoadingError />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
    >
      <p className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
        Profile Settings
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Update your personal information easily
      </p>

      <div className="space-y-10 mt-6">
        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-3 text-sm text-gray-600 dark:text-gray-300">
            User Name
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="dark:bg-transparent dark:text-white !py-7 border-[2px] rounded-xl"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-3 font-semibold text-sm text-gray-600 dark:text-gray-300">
            Email Address
          </label>
          <Input
            name="email"
            type="email"
            disabled
            value={formData.email}
            className="dark:bg-transparent dark:text-white py-7 border-[2px] rounded-xl opacity-70"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-semibold mb-3 text-sm text-gray-600 dark:text-gray-300">
            Bio
          </label>
          <Input
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="dark:bg-transparent dark:text-white !py-7 border-[2px] rounded-xl"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            onClick={() => updateProfile.mutate(formData)}
            disabled={updateProfile.isPending}
            className="bg-blue-950 hover:bg-blue-900 cursor-pointer text-white rounded-lg px-6 py-2 !min-w-[140px] flex items-center justify-center"
          >
            {updateProfile.isPending ? (
              <>
                <LoaderCircleIcon className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
