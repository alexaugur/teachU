// import React from 'react';
import { SchoolLoginDialog } from "../../src/components/auth/school-login-dialog";

// import { get_school, school_login, school_logout, school_register } from "@/lib/api";

// import {SchoolLoginDialog} from "@/components/auth/school-login-dialog";
import {render, fireEvent} from "@testing-library/react";

jest.mock("@/lib/api", () => ({
  //   ...jest.requirxeActual('@/lib/api'),
    fetchData: jest.fn(),
    postData: jest.fn(),
    get_school: jest.fn(),
    school_login: jest.fn(),
    school_logout : jest.fn(),
    school_register : jest.fn(),
    fetchPostingsById : jest.fn()
}));

test("popup dialog opens", () => {
  const { getByTestId, queryByTestId } = render(<SchoolLoginDialog />);
  const loginTrigger = getByTestId("login-button");

  expect(loginTrigger.textContent).toBe("Login");

  // school?.click();
  fireEvent.click(loginTrigger);
  const emailLabel = getByTestId("email");
  const emailField = getByTestId("email_field");
  const passwordField = getByTestId("password_field");

  expect(emailLabel.textContent).toBe("Email");
  passwordField.textContent = "password";
  emailField.textContent = "password";
  const login = getByTestId("handle-login");
  fireEvent.click(login);
  const login2 = queryByTestId("handle-login");
  expect(login2).toBeNull();
  expect(loginTrigger.textContent).toBe("Login");
});



