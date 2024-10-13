import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "../features/user/components/sign-in-form";

export const Route = createFileRoute("/login")({
  component: Component,
});

function Component() {
  return <SignInForm />;
}
