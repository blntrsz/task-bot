import { useNotifications } from "#features/notification/store/notification.store";
import { Button } from "@mui/joy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { addNotification, dismissNotification, notifications } =
    useNotifications();
  const notification = notifications.at(0);
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button
        onClick={() => {
          addNotification({
            type: "primary",
            title: "BOOM!",
          });
        }}
      >
        BOOM
      </Button>
      <Button
        onClick={() => {
          dismissNotification(notification?.id ?? "");
        }}
      >
        HIDE
      </Button>
    </div>
  );
}
