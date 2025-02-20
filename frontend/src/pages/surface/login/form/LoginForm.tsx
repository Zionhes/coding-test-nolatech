import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/libs/cn";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { $loginSchema, type LoginSchema } from "./schema";
import { Link } from "react-router";
import { publics } from "@/routes/pathConstants";
import { usePostLogin } from "../queries/usePostLogin";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver($loginSchema),
  });

  const { mutate, isPending, isSuccess } = usePostLogin();

  const handleSubmit = methods.handleSubmit((data) => mutate(data));

  return (
    <FormProvider {...methods}>
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="nolatech-test@example.com" />
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to={publics.RECOVERY} className="ml-auto">
                <p className="text-sm underline-offset-4 hover:underline">Forgot your password?</p>
              </Link>
            </div>
            <Input name="password" type="password" autoComplete="on" />
          </div>
          <Button disabled={isPending || isSuccess} onClick={handleSubmit} className="w-full">
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={publics.REGISTER}>
            <p className="underline underline-offset-4">Sign up</p>
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
