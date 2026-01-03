import React, { useState } from "react";
import { Lock, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useMutation } from "@tanstack/react-query";

import { handleResponse } from "../../../../utils/handleErrors";
import { changePassword } from "../../../../features/auth/profile/api/profileApi";
import type { ChangePasswordPayload } from "../../../../features/auth/profile/types/Profile";

const SecuritySettings: React.FC = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordData, setPasswordData] = useState<ChangePasswordPayload>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch security info
  // const {
  //   data: userData,
  //   isLoading,
  //   isError,
  // } = useQuery<SecurityResponse>({
  //   queryKey: ["security-info"],
  //   queryFn: getSecurityInfo,
  // });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) =>
      handleResponse({ successCondition: true, successMsg: res.message }),
    onError: (error) => handleResponse({ error }),
  });

  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error fetching user data.</p>;

  return (
    <div className=" dark:bg-black transition-colors">
      <div className="space-y-10">
        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-2xl font-bold text-gray-900 dark:text-white"
        >
          Security Settings
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Manage your account security and active sessions.
        </p>

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-3xl p-6 md:p-8 shadow-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-black">
            <div className="flex items-center gap-3 mb-5">
              <Lock className="text-green-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
            </div>

            <form
              className="space-y-10"
              onSubmit={(e) => {
                e.preventDefault();

                // Clear previous errors
                setErrors({});

                // Basic client-side validation
                const { oldPassword, newPassword, confirmPassword } =
                  passwordData;

                if (!oldPassword) {
                  setErrors({ oldPassword: "Enter your current password" });
                  return;
                }

                if (!newPassword || newPassword.length < 8) {
                  setErrors({
                    newPassword: "New password must be at least 8 characters",
                  });
                  return;
                }

                if (newPassword !== confirmPassword) {
                  setErrors({ confirmPassword: "Passwords do not match" });
                  return;
                }

                // All good — submit
                changePasswordMutation.mutate(passwordData);
              }}
            >
              <div className="relative">
                <Label className="text-gray-700 dark:text-gray-300 mb-5">
                  Current Password
                </Label>
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  required
                  onChange={handleChange}
                  className="rounded-xl bg-transparent border !shadow-lg border-gray-300 dark:border-gray-700 py-7 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
                />
                {errors.oldPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.oldPassword}
                  </p>
                )}
                <div
                  className="absolute right-3 top-[65%] -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Label className="text-gray-700 dark:text-gray-300 mb-5">
                    New Password
                  </Label>
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    required
                    onChange={handleChange}
                    className="mt-1 rounded-xl bg-transparent border !shadow-lg border-gray-300 dark:border-gray-700 py-7 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
                  />
                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                  <div
                    className="absolute right-3 top-[65%] -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <div className="flex-1 relative">
                  <Label className="text-gray-700 dark:text-gray-300 mb-5">
                    Confirm Password
                  </Label>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    name="confirmPassword"
                    required
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 rounded-xl bg-transparent border !shadow-lg border-gray-300 dark:border-gray-700 py-7 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                  <div
                    className="absolute right-3 top-[65%] -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="py-3 px-7 rounded-xl bg-blue-950 hover:bg-blue-900 !text-white  cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <LoaderCircleIcon className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Active Sessions Section */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-3xl p-6 md:p-8 shadow-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#1a1a1a]">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="text-green-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Login Sessions
              </h2>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Manage your active sessions across devices.
            </p>

            <div className="space-y-4">
              {[
                {
                  device: "MacBook Pro",
                  location: "Lagos, Nigeria",
                  active: true,
                },
                {
                  device: "iPhone 15",
                  location: "Abuja, Nigeria",
                  active: false,
                },
              ].map((session, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-4 px-5 rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-[#222] transition"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.device}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.location}
                    </p>
                  </div>
                  {session.active ? (
                    <span className="text-green-500 text-sm font-medium">
                      Active now
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-lg"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div> */}
      </div>
    </div>
  );
};

export default SecuritySettings;
