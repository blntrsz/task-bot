import { useNotifications } from "../store/notification.store";
import { Snackbar } from "@mui/joy";

export const Notifications = () => {
  const { dismissNotification } = useNotifications();
  const notification = useNotifications(({ notifications }) =>
    notifications.at(0),
  );

  if (!notification) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end space-y-4 px-4 py-6 sm:items-start sm:p-6"
    >
      <Snackbar
        key={notification.id}
        onUnmount={() => dismissNotification(notification.id)}
        autoHideDuration={5_000}
        open
        color={notification.type}
      />
    </div>
  );
};
