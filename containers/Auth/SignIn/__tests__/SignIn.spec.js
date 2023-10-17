import React from "react";
import { shallow } from "enzyme";
import SignIn from "../SignIn";

jest.mock("react-router-dom", () => ({
  useLocation: () => ({}),
}));

jest.mock("@assets/images/logo.jpeg", () => ({
  Logo: () => ({}),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn().mockReturnValue({
    currentUser: "",
    errorMessage: "",
    actionType: "",
  }),
  useDispatch: () => ({}),
}));

afterAll(() => {
  jest.unmock("react-redux");
  jest.unmock("react-router-dom");
  jest.unmock("@assets/images/logo.jpeg");
});

describe("SignIn", () => {
  it("should render component with logo", () => {
    const wrapper = shallow(<SignIn />);
    expect(wrapper.find("img.logoWrapper").length).toBe(1);
  });

  it('should have an email field', () => {
    const wrapper = shallow(<SignIn />);
    expect(wrapper.find('.inputWrapper').at(0).length).toEqual(1);
  });

  it('should have an password field', () => {
    const wrapper = shallow(<SignIn />);
    expect(wrapper.find('.inputWrapper').at(1).length).toEqual(1);
  });
});
