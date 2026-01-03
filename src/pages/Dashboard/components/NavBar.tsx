import { useEffect, useState } from "react";
import { Avatar } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import SearchBar from "../../../components/search/search";
import LogoutButton from "../../../features/auth/logout/logout";
import { Link } from "react-router-dom";

import type { UserProfileResponse } from "../../../features/auth/profile/types/Profile";
import { getUserProfile } from "../../../features/auth/profile/api/profileApi";
import { getProfilePicture } from "../../../features/auth/profile/api/profileApi";
import NotificationBall from "./NotificationBall";

const Navbar = () => {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("Unknown Email");
  const [dpUrl, setDpUrl] = useState<string | null>(null);

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Fetch user profile info
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile: UserProfileResponse = await getUserProfile();
        setUserName(profile.user.name);
        setUserEmail(profile.user.email);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    loadProfile();
  }, []);

  // Fetch profile picture separately
  useEffect(() => {
    const loadDp = async () => {
      try {
        const res = await getProfilePicture();
        if (res.picture?.url) {
          setDpUrl(res.picture.url);
        }
      } catch (err) {
        console.error("Failed to fetch profile picture:", err);
        setDpUrl(null);
      }
    };

    loadDp();

    // Optional: poll every few seconds for instant updates
    const interval = setInterval(loadDp, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-2 px-4 sm:px-7 flex items-center justify-end border-b-[1px] border-neutral-400 dark:border-neutral-800 shadow-2xs">
      <div className="flex items-center gap-7">
        {/* Search */}
        <SearchBar />

        {/* Notifications */}
       <NotificationBall />

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {dpUrl ? (
              <Avatar
                src={dpUrl}
                size="default"
                style={{ cursor: "pointer" }}
                className="!bg-transparent"
                onError={() => {
                  setDpUrl(null); // update state
                  return false; // tell AntD to fallback to default
                }}
              />
            ) : (
              <Avatar
                style={{ backgroundColor: "#252520", cursor: "pointer" }}
                size="default"
                className="!bg-orange-500 dark:!bg-[#252520]"
              >
                {initials}
              </Avatar>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-md dark:bg-[#252525] dark:text-white shadow-lg cursor-pointer bg-gray-50 text-black dark:border-none"
            align="end"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700">
              <div className="text-sm">
                <p className="font-semibold text-black dark:text-white">
                  {userName}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {userEmail}
                </p>
              </div>
            </div>

            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-50 cursor-pointer">
              <UserOutlined />
              <span>Profile</span>
            </DropdownMenuItem>

            <Link to={"settings"}>
              <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-50 cursor-pointer">
                <SettingOutlined />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className="flex items-center gap-2 focus:bg-gray-700 focus:text-gray-50 cursor-pointer">
              <PlusOutlined />
              <span>New Workspace</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-700" />

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem className="p-0">
                <LogoutButton />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
