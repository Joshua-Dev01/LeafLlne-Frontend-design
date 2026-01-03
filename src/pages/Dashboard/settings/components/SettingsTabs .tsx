import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import NotificationTab from "../../notifications/NotificationTab";
import AppearanceTab from "../../../../context/themeSelector";
import SecuritySettings from "../security/Security";
import ProfileUpdate from "../../../../features/auth/profile/components/ProfileUpdate";

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-24 w-full"
    >
      {/* Tabs Header */}
      <Box
        sx={{
          borderBottom: 0,
          display: "flex",
          justifyContent: "flex-start",
          bgcolor: "transparent",
          "& .MuiTabs-flexContainer": {
            gap: "1.5rem",
          },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#3b82f6", // Tailwind blue-500
              height: 3,
              borderRadius: 9999,
            },
          }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.95rem",
              transition: "all 0.3s ease",
              padding: 0,
              minWidth: "auto",
              color: "inherit",
            },
            "& .Mui-selected": {
              color: "#3b82f6 !important", // blue when active
            },
            "& .MuiTabs-indicator": {
              transition: "all 0.3s ease",
            },
          }}
          className="dark:text-white text-black"
        >
          <Tab
            label="Profile"
            className={`!text-[16px] leading-tight  ${
              activeTab === 0
                ? "text-blue-500 !font-semibold dark:text-white"
                : "!text-[#000000] !font-semibold dark:!text-white hover:text-blue-400"
            }`}
          />
          <Tab
            label="Notifications"
            className={`!text-[16px] ${
              activeTab === 1
                ? "!text-blue-800 !font-semibold dark:text-blue-400 "
                : "!text-[#000000] !font-semibold dark:!text-white hover:text-blue-400 "
            }`}
          />

          <Tab
            label="Security"
            className={`!text-[16px] leading-tight ${
              activeTab === 2
                ? "text-blue-500 !font-semibold dark:text-blue-400"
                : "!text-[#000000] !font-semibold dark:!text-white hover:text-blue-400"
            }`}
          />

          <Tab
            label="Appearance"
            className={`!text-[16px] leading-tight ${
              activeTab === 3
                ? "text-blue-500 !font-semibold dark:text-blue-400"
                : "!text-[#000000] !font-semibold dark:!text-white hover:text-blue-400"
            }`}
          />
        </Tabs>
      </Box>

      {/* Tabs Content */}
      <div className="mt-10">
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 dark:!text-gray-200"
            >
              <ProfileUpdate />
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 dark:text-gray-200"
            >
              <NotificationTab />
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 text dark:text-gray-200"
            >
              <SecuritySettings />
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 dark:text-gray-200"
            >
              <AppearanceTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SettingsTabs;
