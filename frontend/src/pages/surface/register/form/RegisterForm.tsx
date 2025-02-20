import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/libs/cn";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router";
import { INDEX } from "@/routes/pathConstants";
import { usePostRegister } from "../queries/usePostRegister";
import { registerSchema, type RegisteSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const methods = useForm<RegisteSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = usePostRegister();

  const handleSubmit = methods.handleSubmit((data) => mutate({ ...data, role: "admin" }));

  return (
    <FormProvider {...methods}>
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create Admin account</h1>
          {/* <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p> */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to={INDEX}>
              <span className="underline underline-offset-4">Sign in</span>
            </Link>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-1.5">
            <Label htmlFor="firstNames">Name</Label>
            <Input name="firstName" placeholder="Anderson José" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lastNames">Last Name</Label>
            <Input name="lastName" placeholder="Ramos Román" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="nolatech-test@example.com" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input name="password" type="password" />
          </div>
          <Button disabled={isPending} onClick={handleSubmit} className="w-full">
            Register
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
