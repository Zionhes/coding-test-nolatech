import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUserMutations } from "../queries/useUsers";
import { User } from "@/store/authSlice";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateUserSchema, createUserSchema } from "../schema";
import InputErrorMessage from "@/components/InputErrorMessage";

interface UserFormProps {
  defaultValues?: User | undefined;
  onClose: () => void;
}

const UserForm = ({ defaultValues, onClose }: UserFormProps) => {
  const methods = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  const { createUser, updateUser } = useUserMutations();
  const { isPending: isUpdatePending } = updateUser;
  const { isPending: isCreatePending } = createUser;

  console.log(methods.formState.errors);
  console.log(methods.getValues());

  const handleSubmit = methods.handleSubmit((data) => {
    if (defaultValues) updateUser.mutate({ id: defaultValues.id, user: data });
    else createUser.mutate(data);
    onClose();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <Label>First Name</Label>
          <Input name="firstName" placeholder="Anderson" />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="lastName" placeholder="Ramos" />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="coding-test@nolatech.com" />
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password" placeholder="password" autoComplete="on" />
        </div>
        <div className="relative">
          <Label>Role</Label>
          <Controller
            name="role"
            control={methods.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <InputErrorMessage
            name="role"
            errors={methods.formState.errors}
            isInputInvalid={methods.getFieldState("role").invalid}
          />
        </div>
        <div>
          <Button disabled={defaultValues ? isUpdatePending : isCreatePending}>
            {defaultValues ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserForm;
