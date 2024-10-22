import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useEffect } from "react";
import {
  fetchTeacherApplicationCart,
  clearTeacherApplicationCart,
} from "../lib/api";
import type { ApplicationCart, JobPostings, Postings } from "../lib/types";

export function ApplicationCart({
  onApplyAllClick,
  onJobsLoaded,
}: {
  onApplyAllClick: () => void;
  onJobsLoaded: (jobs: JobPostings[]) => void;
}) {
  const [cart, setCart] = useState<ApplicationCart | null>(null);
  const teacherId = 14; // replace with the actual teacher_id
  const cartId = 8; // replace with the actual cart_id (change to same as teacher_id upon creation of teacher user account)

  useEffect(() => {
    fetchTeacherApplicationCart(teacherId)
      .then((cart) => {
        setCart(cart);
      })
      .catch(console.error);
  }, [teacherId]);

  function onModalOopen() {
    fetchTeacherApplicationCart(teacherId)
    .then((cart) => {
      setCart(cart);
    })
    .catch(console.error);
  }

  const applyToAllApps = () => {
    onJobsLoaded(cart.job_postings as JobPostings[]);
    clearTeacherApplicationCart();
    onApplyAllClick();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-xl" variant="secondary" size="iconLg" onClick={onModalOopen}>
          <img
            className="w-[4rem] h-[4rem] rounded-xl pl-2.5 pr-1.5 py-2"
            src="../../public/assets/icon-mass-apps.png"
            alt="Shopping Cart"
          />
          {/* hello */}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between ">
        <div>
          <SheetHeader>
            <SheetTitle>Multi-Apply Jobs List</SheetTitle>
            <SheetDescription>
              Add interested jobs here and batch apply to all of them at once!
            </SheetDescription>
          </SheetHeader>
          <SheetDescription
            className="pt-[1.5rem] text-[#121212] pb-2"
            style={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            Your pending applications
          </SheetDescription>
          {/*TODO: Jobs List*/}
          <div className="border h-full rounded-lg p-2">
            {cart ? (
              cart.job_postings.length > 0 ? (
                cart.job_postings.map((job) => (
                  <div>
                    {/* <div key={job.id}>Job ID: {job.id}</div> */}
                    <div key={job?.job_info?.title}>{job?.job_info?.title}</div>
                  </div>
                ))
              ) : (
                <div>No jobs in the application cart</div>
              )
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={applyToAllApps}>
              Apply to All
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
