// import { useEffect, useState } from "react";
// import SettingsContent from "./SettingsContents";
// import SettingsSidebar from "./SettingsSidebar";

import SettingsHeader from "../../../../features/auth/profile/components/ProfilePhoto";
import LogoutButton from "../../../../features/auth/logout/logout";
import SettingsTabs from "./SettingsTabs ";

export const Settings = () => {
  // const [userName, setUserName] = useState("User");

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("leafline_user") || "{}");
  //   setUserName(user?.name || "User");
  // }, []);

  return (
    <div className="">
      {/* Sidebar (fixed width) */}
      <div className=" ">
        {/* <SettingsSidebar userName={userName} /> ✅ Pass name here */}
        <SettingsHeader />
        <SettingsTabs />

        <div className="mt-8 flex justify-end px-4 pb-6">
          <LogoutButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1  ">{/* <SettingsContent /> */}</div>
    </div>
  );
};
