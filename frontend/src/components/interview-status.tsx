// "use client";

// import { SchoolTeacherUser } from "@/lib/types";
// // import React, { useState } from "react";
// import "../App.css";
// import ApplicationSchoolButtons from "./application-posting-school-buttons";
// // import JobPostingSchoolButtons from "./job-posting-school-buttons";
// import TeacherInterviewStatusButtons from "../components/teacher-interviewing-button";

// export default function TeacherInterviewStatus({
//   application,
// }: {
//   application: SchoolTeacherUser;
// }) {
//   const status = "interviewing";
//   const date = "Friday, 04/19/2024";
//   const time = "10:30am";

//   return (
//     <>
//       <div className="list">
//         <div>
//           <p className="heading3">Interview Status: {status}</p>
//           {status == "interviewing" && (
//             <>
//               <p className="text2">Date: {date}</p>
//               <p className="text2">Time: {time}</p>
//             </>
//           )}
//         </div>

//         <div>{<TeacherInterviewStatusButtons application={application} />}</div>
//       </div>
//     </>
//   );
// }
