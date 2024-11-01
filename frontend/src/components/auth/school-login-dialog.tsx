import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import useMutationSchoolUser from "@/hooks/use-mutations-schools";

export const SchoolLoginDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { loginSchoolUser } = useMutationSchoolUser();

  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Sorry! Email and password cannot be empty!",
        description: `Please enter your credentials to login.`,
      });
      return;
    }

    loginSchoolUser(email, password);

    // getSchoolProfile(email);
    clearFields();
  };

  const handleCancel = () => {
    clearFields();
  };

  return (
    <Dialog data-testid="school-login-dialog">
      <DialogTrigger asChild>
        <Button
          data-testid="login-button"
          aria-label={"Click to login"}
          variant="default"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Provide your credentials here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label
              data-testid="email"
              htmlFor="username"
              className="text-right"
            >
              Email
            </Label>
            <Input
              data-testid="email_field"
              id="username"
              value={email}
              className="col-span-3"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="example@example.com"
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              data-testid="password_field"
              id="password"
              value={password}
              className="col-span-3"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="password"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"} type="reset" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={handleLogin}
              data-testid="handle-login"
            >
              Login
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
