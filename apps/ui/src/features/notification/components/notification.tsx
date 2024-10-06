import { useNotifications } from "../store/notification.store";
import { Button, Snackbar } from "@mui/joy";

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications();
  const notification = notifications.at(0);

  if (!notification) return null;

  return (
    <Snackbar
      key={notification.id}
      onClose={() => dismissNotification(notification.id)}
      onUnmount={() => dismissNotification(notification.id)}
      autoHideDuration={5_000}
      open
      color={notification.type}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      endDecorator={
        <Button
          variant="outlined"
          onClick={() => dismissNotification(notification.id)}
          size="sm"
        >
          Dismiss
        </Button>
      }
    >
      {notification.title}
    </Snackbar>
  );
};
