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
// import { useToast } from "@/components/ui/use-toast";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { JobInfo } from "@/lib/types";
import { toast } from "./ui/use-toast";

export const SchoolJobEditDialog = ({
  params,
}: {
  params: { id: number; job_info: JobInfo; school_id: number };
}) => {
  const [title, setTitle] = useState(params.job_info?.title);
  const [description, setDescription] = useState(params?.job_info?.description);
  const [salary_est, setSalary_est] = useState(
    params?.job_info?.salary_est.toString()
  );
  const [start_date, setStart_date] = useState(params?.job_info?.start_date);
  const [interview_length, setInterview_length] = useState(params?.job_info?.interview_length);

  // const { toast } = useToast();

  const { updatePostings } = useSchoolPostingQueryPosts();

  const clearFields = () => {
    setTitle(params?.job_info?.title);
    setDescription(params?.job_info?.description);
    setSalary_est(params?.job_info?.salary_est.toString());
    setStart_date(params?.job_info?.start_date);
    setInterview_length(params?.job_info?.interview_length);
  };
  function isValidFloat(str: string): boolean {
    return /^\d*\.?\d+$/.test(str);
  }

  const handleLogin = async () => {
    //login
    if (!isValidFloat(salary_est.toString())) {
      toast({
        variant: "destructive",
        title: "Sorry! Salary must be a number!",
        description: `Please input an integer representing the annual salary.`,
      });
      return;
    } else {
      updatePostings(
        params.id,
        description,
        title,
        salary_est.toString(),
        start_date,
        interview_length
      );
      clearFields();
    }
  };

  const handleCancel = () => {
    clearFields();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={"Click to login"}
          variant="default"
          style={{ marginLeft: "2px", marginTop: "2px", width: "166px" }}
        >
          Edit this posting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit this posting</DialogTitle>
          <DialogDescription>Update the information here:</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="username" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              className="col-span-3"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="password" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              className="col-span-3"
              type="description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="password" className="text-right">
              Start Date
            </Label>
            <Input
              id="start_date"
              value={start_date}
              className="col-span-3"
              type="experience"
              onChange={(e) => {
                setStart_date(e.target.value);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="password" className="text-right">
              Salary Estimate
            </Label>
            <Input
              id="salary_est"
              value={salary_est}
              className="col-span-3"
              type="salary_est"
              onChange={(e) => {
                setSalary_est(e.target.value);
              }}
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="password" className="text-right">
              Interview Length
            </Label>
            <select value={interview_length} onChange={(e) => setInterview_length(parseInt(e.target.value))} >
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>

          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"} type="reset" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={handleLogin}>
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
