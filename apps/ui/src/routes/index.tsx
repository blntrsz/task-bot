import { ButtonLink } from "#components/button-link";
import { useNotifications } from "#features/notification/store/notification.store";
import { Button } from "@mui/joy";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component,
});

function component() {
  const { addNotification, dismissNotification, notifications } =
    useNotifications();
  const notification = notifications.at(0);
  return (
    <div className="p-2">
      <ButtonLink href="/about">hello</ButtonLink>
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
