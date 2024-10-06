import { Button } from "@mui/joy";
import { Register, Link } from "@tanstack/react-router";

type ButtonLinkProps = {
  href: keyof Register["router"]["routesByPath"];
} & React.ComponentProps<typeof Button>;

export function ButtonLink({ href, ...props }: ButtonLinkProps) {
  // @ts-ignore
  return <Button component={Link} href={href} to={href} {...props} />;
}
