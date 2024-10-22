// import React from "react";
// import { render, fireEvent } from "@testing-library/react";
// import { SchoolHeaderNavBar } from "../../src/components/school/school-header-nav-bar";
// import { useNavigate } from "react-router-dom";

// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: jest.fn(),
// }));

// jest.mock("@/lib/store", () => ({
//   useStore: jest.fn(),
// }));

// jest.mock("../../src/components/auth/school-logout-dialog", () => ({
//   SchoolLoginDialog: jest.fn(),
// }));

// jest.mock("../../src/components/auth/school-logout-dialog", () => ({
//   SchoolLogoutDialog: jest.fn(),
// }));

// jest.mock("../../src/components/auth/school-register-dialog", () => ({
//   SchoolRegisterDialog: jest.fn(),
// }));

// test("school user can navigate to My Dashboard", () => {
//   const navigate = jest.fn();
//   (useNavigate as jest.Mock).mockReturnValue(navigate);
//   (require("@/lib/store") as any).useStore.mockReturnValue(true);

//   const { getByText } = render(<SchoolHeaderNavBar />);

//   const myDashboardButton = getByText("My Dashboard");
//   fireEvent.click(myDashboardButton);

//   expect(navigate).toHaveBeenCalledWith("/schoolaccountview");
// });

// test("school user can navigate to Profile", () => {
//   const navigate = jest.fn();
//   (useNavigate as jest.Mock).mockReturnValue(navigate);
//   (require("@/lib/store") as any).useStore.mockReturnValue(true);

//   const { getByText } = render(<SchoolHeaderNavBar />);

//   const profileButton = getByText("Profile");
//   fireEvent.click(profileButton);

//   expect(navigate).toHaveBeenCalledWith("/schoolprofileview");
// });

test("Sanity check", () => {
    expect(true).toBe(true);
});