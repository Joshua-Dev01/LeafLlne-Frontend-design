import { Switch, Select } from "antd";
import ThemeSelector from "../../../../context/themeSelector";

const SettingsContent = () => {
  return (
    <div className="flex-1 shadow-2xl  text-black dark:text-white p-6 overflow-y-auto">
      {/* Preferences Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <div className="mt-3">
          <p className="text-gray-400 text-sm">Appearance</p>
          <div className="flex justify-between items-center bg-indigo-100 shadow-2xl dark:bg-[#2b2b2b] rounded-md p-3 mt-1">
            <span>Customize how LeafLine looks on your device.</span>
            <ThemeSelector />
          </div>
        </div>
      </section>

      {/* Language & Time Section */}
      <section>
        <h2 className="text-lg font-semibold">Language & Time</h2>

        <div className="mt-3 space-y-5">
          <div>
            <p className="text-gray-400 text-sm">Language</p>
            <Select
              defaultValue="English (US)"
              style={{ width: 180 }}
              options={[{ value: "en-US", label: "English (US)" }]}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Start week on Monday</p>
              <p className="text-gray-500 text-xs">
                This will change how all calendars in your app look.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                Set timezone automatically using your location
              </p>
              <p className="text-gray-500 text-xs">
                Reminders, notifications, and emails are delivered based on your
                timezone.
              </p>
            </div>
            <Switch defaultChecked  />
          </div>

          <div>
            <p className="text-gray-400 text-sm">Timezone</p>
            <p className="text-gray-500 text-xs mt-1">(GMT +1:00) Lagos</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsContent;
