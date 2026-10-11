import { NotificationPreferenceList } from "./components/NotificationPreferenceList";

const NotificationTab = () => {
  return (
    <div className="rounded-3xl p-6 md:p-8 shadow-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-black">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
        Notifications
      </h3>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Choose which categories appear in your notification feed.
      </p>
      <NotificationPreferenceList />
    </div>
  );
};

export default NotificationTab;
