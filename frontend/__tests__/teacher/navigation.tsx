// import React from 'react';
import { HeaderNavBar } from "../../src/components/teachers/teacher-header-nav-bar";

import React from "react";
import { useNavigate } from "react-router-dom";
import { render, fireEvent } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/lib/api", () => ({}));

test("teacher can navigate to job board", () => {
  const navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);

  const { getByText } = render(<HeaderNavBar />);

  const jobBoardButton = getByText("Job Board");
  fireEvent.click(jobBoardButton);

  expect(navigate).toHaveBeenCalledWith("/jobboardteacherview");
});

test("teacher can navigate to school list", () => {
  const navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);

  const { getByText } = render(<HeaderNavBar />);

  const schoolListButton = getByText("School List");
  fireEvent.click(schoolListButton);

  expect(navigate).toHaveBeenCalledWith("/school-list-teacher-view");
});

test("teacher can navigate to applied jobs view", () => {
  const navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);

  const { getByText } = render(<HeaderNavBar />);

  const appliedJobsButton = getByText("Applied Jobs");
  fireEvent.click(appliedJobsButton);

  expect(navigate).toHaveBeenCalledWith("/teacher-application-view");
});

test("teacher can navigate to teacher dashboard", () => {
  const navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);

  const { getByText } = render(<HeaderNavBar />);

  const dashboardButton = getByText("My Dashboard");
  fireEvent.click(dashboardButton);

  expect(navigate).toHaveBeenCalledWith("/teacheraccountview");
});
