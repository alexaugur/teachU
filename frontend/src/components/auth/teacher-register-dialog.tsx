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
import useMutationTeacherUser from "@/hooks/use-mutations-teachers";
import { useNavigate } from "react-router-dom";
import { get_from_resume} from "@/lib/api";
// import { getAuthenticatedTeacherUserToken } from "@/lib/teacherauth";

export const TeacherRegisterDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [current_school, setCurrentSchool] = useState("");
  const [subjects_taught, setSubjectsTaught] = useState("");
  const [current_state, setCurrentState] = useState("");
  const [grades_taught, setGradesTaught] = useState("");
  const [years_of_experience, setYearsOfExperience] = useState("");
  const [education, setEducation] = useState("");
  const [past_jobs, setPastJobs] = useState("");
  const [accolades, setAccolades] = useState("");
  const [accomodations, setAccomodations] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const get_from_resume = async (file
  //   ): Promise<string> => {
  //     const API_URL = import.meta.env.VITE_API_URL;
  //     const token = getAuthenticatedTeacherUserToken();

  //     const formData = new FormData();
  //     formData.append('resume', file);

  //     const response = await fetch(`${API_URL}/teachers/upload_resume`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const responseJson = await response.json();
  //     if (!response.ok) {
  //       throw new Error(
  //         `Error: ${response.status} - ${
  //           responseJson.message || response.statusText
  //         }`,
  //       );
  //     }
  //     return responseJson;
  //   };
  const { toast } = useToast();
  const handleUpload = async () => {
    
    try {
      const response = await get_from_resume(file);
      setFirstName(response["first_name"]);
      setLastName(response["last_name"]);
      setCurrentSchool(response["current_school"]);
      setSubjectsTaught(response["subjects_taught"]);
      setCurrentState(response["current_state"]);
      setGradesTaught(response["grades_taught"]);
      setYearsOfExperience(response["years_of_experience"]);
      setPastJobs(response["past_jobs"]);
      setAccolades(response["accolades"]);
      setAccomodations(response["accomodations"]);

    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Resume upload feature not working",
        description: `Please enter your credentials manually.`,
      });
      


    }
   
    
      

    
    
  };

  //const { toast } = useToast();
  const { registerTeacherUser, loginTeacherUser } = useMutationTeacherUser();

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCurrentSchool("");
    setSubjectsTaught("");
    setCurrentState("");
    setGradesTaught("");
    setYearsOfExperience("");
    setEducation("");
    setPastJobs("");
    setAccolades("");
    setAccomodations("");
  };
  function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const navigate = useNavigate();
  const handleSave = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Sorry! Email or password cannot be empty! 🙁",
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

    if (!first_name || !last_name) {
      toast({
        variant: "destructive",
        title: "Sorry! Please enter a valid name! 🙁",
        description: `Please enter the required information to register.`,
      });
      return;
    }

    const registrationSuccess = await registerTeacherUser(
      email,
      password,
      first_name,
      last_name,
      current_school,
      subjects_taught,
      current_state,
      grades_taught,
      years_of_experience,
      past_jobs,
      accolades,
      accomodations,
      education
    );

    if (registrationSuccess) {
      await loginTeacherUser(email, password);
    }
    

    clearFields();

    try {
      navigate("/signed-up-teacher");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleCancel = () => {
    clearFields();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label={"Click to register"} variant="outline">
          Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Register</DialogTitle>
          <DialogDescription className="text-gray-500">
            Please complete this form to register.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium">
                Email <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="email"
                value={email}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
              />
              <div className="h-[1px] bg-gray-300 mt-1"></div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium">
                Password <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
              <div className="h-[1px] bg-gray-300 mt-1"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="resume" className="font-medium">
                Upload Resume
              </Label>
              <div className="flex items-center">
                <Input
                  type="file"
                  accept="application/pdf"
                  className="border rounded px-3 py-2 flex-1"
                  onChange={handleFileChange}
                />
                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
          <p className="text3">
            <strong>OR</strong>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name" className="font-medium">
                First Name <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="first_name"
                value={first_name}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name" className="font-medium">
                Last Name <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="last_name"
                value={last_name}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current_school" className="font-medium">
                Current School
              </Label>
              <Input
                id="current_school"
                value={current_school}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setCurrentSchool(e.target.value)}
                placeholder="Example Elementary School"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subjects_taught" className="font-medium">
                Subjects Taught
              </Label>
              <Input
                id="subjects_taught"
                value={subjects_taught}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setSubjectsTaught(e.target.value)}
                placeholder="Grade 3 Math, Grade 7 History, etc."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current_state" className="font-medium">
                Current State
              </Label>
              <Input
                id="current_state"
                value={current_state}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setCurrentState(e.target.value)}
                placeholder="MD"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grades_taught" className="font-medium">
                Grades Taught
              </Label>
              <Input
                id="grades_taught"
                value={grades_taught}
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setGradesTaught(e.target.value)}
                placeholder="3, 7"
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="years_of_experience" className="font-medium">
                  Years of Experience
                </Label>
                <Input
                  id="years_of_experience"
                  value={years_of_experience}
                  className="border rounded px-3 py-2 w-full"
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="6"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="past_jobs" className="font-medium">
                  Past Jobs
                </Label>
                <Input
                  id="past_jobs"
                  value={past_jobs}
                  className="border rounded px-3 py-2 w-full"
                  onChange={(e) => setPastJobs(e.target.value)}
                  placeholder="List any past jobs other than teaching here."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="past_jobs" className="font-medium">
                  Accomodations
                </Label>
                <Input
                  id="past_jobs"
                  value={accomodations}
                  className="border rounded px-3 py-2 w-full"
                  onChange={(e) => setAccomodations(e.target.value)}
                  placeholder="List any past jobs other than teaching here."
                />
              </div>
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="secondary" type="reset" onClick={handleCancel}>
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
