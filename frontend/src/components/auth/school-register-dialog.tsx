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
import ComboboxDemo from "../StateComboBox";
import CityComboboxDemo from "../CityComboBox";
import { useStore } from "@/lib/store";

export const SchoolRegisterDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const state = useStore((state) => state.state);
  const city = useStore((state) => state.city);
  const setState = useStore((state) => state.setState);
  const setCity = useStore((state) => state.setCity);

  const { toast } = useToast();
  const { registerSchoolUser, loginSchoolUser } = useMutationSchoolUser();

  const clearFields = () => {
    setPassword("");
    setName("");
    setEmail("");
    setCity("");
    setState("");
  };

  function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSave = async () => {
    if (!email || !password || !name || !city || !state) {
      toast({
        variant: "destructive",
        title: "Sorry! No Fields can be empty! 🙁",
        description: `Please enter the required information to register.`,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Sorry! Please enter a valid email! 🙁",
        description: `Please enter the required information to register.`,
      });
      return;
    }

    const registrationSuccess = await registerSchoolUser(email, password, name, city, state);

    if (registrationSuccess) {
    await loginSchoolUser(email, password);
    
    }
    clearFields();

  };

  const handleCancel = () => {
    clearFields();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label={"Click to login"} variant="outline">
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>
            Please complete this form to register.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-6">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
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
              id="password"
              type="password"
              value={password}
              className="col-span-3"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="password"
            />
          </div>

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              School Name
            </Label>
            <Input
              id="name"
              type="name"
              value={name}
              className="col-span-3"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Example Elementary School"
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="city" className="text-right">
              State
            </Label>
            <ComboboxDemo />
          </div>

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <CityComboboxDemo />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"} type="reset" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
