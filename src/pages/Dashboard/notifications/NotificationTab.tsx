import { Switch } from "antd";

const NotificationTab = () => {
  return (
    <div className="rounded-3xl p-6 md:p-8 shadow-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-black">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Notifications
      </h3>
      <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
        <span className="text-neutral-700 dark:text-neutral-300">
          Email alerts
        </span>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
        <span className="text-neutral-700 dark:text-neutral-300">
          New message alerts
        </span>
        <Switch />
      </div>
      <div className="flex items-center justify-between py-3">
        <span className="text-neutral-700 dark:text-neutral-300">
          App updates
        </span>
        <Switch defaultChecked />
      </div>
    </div>
  );
};

export default NotificationTab;
