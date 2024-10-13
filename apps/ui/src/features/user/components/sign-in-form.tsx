import { Button, FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useSignIn } from "../api/sign-in";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

export function SignInForm() {
  const signIn = useSignIn();
  const form = useForm({
    defaultValues: {
      password: "",
      email: "",
    },
    async onSubmit({ value }) {
      await signIn.mutateAsync(value);
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <Stack sx={{ gap: 4, mt: 2 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Stack sx={{ gap: 2 }}>
          <FormControl required>
            <FormLabel>Email</FormLabel>
            <form.Field
              name="email"
              validators={{
                onChange: z.string().email(),
              }}
              children={(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                />
              )}
            />
          </FormControl>
          <FormControl required>
            <FormLabel>Password</FormLabel>
            <form.Field
              name="password"
              validators={{
                onChange: z.string().min(8),
              }}
              children={(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                />
              )}
            />
          </FormControl>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
              children={([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  type="submit"
                  disabled={!isDirty || !canSubmit || isSubmitting}
                  fullWidth
                >
                  Sign in
                </Button>
              )}
            />
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
