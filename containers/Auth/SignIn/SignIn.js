import { Row, Col, notification, Form, Card } from "antd";
import { Redirect, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Input from "@components/uielements/input";
import Checkbox from "@components/uielements/checkbox";
import Button from "@components/uielements/button";
import IntlMessages from "@components/utility/intlMessages";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import authAction from "@redux/auth/actions";
import appAction from "@redux/app/actions";
import Logo from "@assets/images/logo.jpeg";
import SignInStyleWrapper from "./SignIn.styles";
import { useEffect } from "react";
import { textFieldRules } from "@components/Common/formOptions";
import { variables } from "@assets/styles/variables";
import { useHistory } from "react-router-dom";

const { login, resetActionType } = authAction;
const { changeCurrent } = appAction;

export default function SignIn() {
  const navigate = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const { currentUser, errorMessage, isFetching, actionType } = useSelector(
    (state) => state.Auth
  );

  const isSuccess = actionType === "LOGIN_SUCCESS";
  const isError = actionType === "LOGIN_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
      dispatch(resetActionType());
    }
  }, [actionType]);

  const handleLogin = (values) => {
    dispatch(login(config.login, values));
    dispatch(changeCurrent(["dashboard"]));
  };

  const { from } = location.state || { from: { pathname: "/dashboard" } };

  if (currentUser?.employee_name) {
    return <Redirect to={from} />;
  }

  const onClick = (e) => {
    navigate.push("/cisreports");
  };

  return (
    <div>
      <SignInStyleWrapper>
        <div className="loginContentWrapper">
          <div className="loginContent">
            <Row>
              <Col span={12}>
                <img
                  src={Logo}
                  style={{ height: "200px", width: "180px" }}
                  className="logoWrapper"
                  alt="logo"
                />
              </Col>
              <Col span={12}>
                <Form
                  className="signInForm"
                  onFinish={handleLogin}
                  initialValues={{
                    remember: true,
                  }}
                >
                  <Form.Item
                    name="paoCode"
                    rules={[
                      {
                        required: true,
                        message: "Please input your PAO number",
                      },
                      textFieldRules.textFieldMaxLength,
                    ]}
                  >
                    <div className="inputWrapper">
                      <Input
                        size="large"
                        placeholder="PAO Number"
                        type="text"
                        autoComplete="true"
                        maxLength={textFieldRules.maxLength}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password",
                      },
                      textFieldRules.textFieldMaxLength,
                    ]}
                  >
                    <div className="inputWrapper">
                      <Input
                        size="large"
                        placeholder="Password"
                        type="password"
                        autoComplete="true"
                        maxLength={textFieldRules.maxLength}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item name="remember" valuePropName="checked">
                    <div className="inputWrapper leftRightComponent">
                      <Checkbox>
                        <IntlMessages id="page.signInRememberMe" />
                      </Checkbox>
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <div className="centerComponent helperWrapper">
                      <Button type="primary" htmlType="submit" block>
                        <IntlMessages id="page.signInButton" />
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            {isFetching && <Loader />}
          </div>
          <div
            style={{
              background: `${variables.PRIMARY_BLUE}`,
            }}
          >
            <Card
              style={{
                fontSize: 15,
                marginTop: 30,
                borderRadius: 8,
                height: 150,
              }}
            >
              <p
                style={{
                  color: "#c6c6c6",
                }}
              >
                Action Links
              </p>
              <a onClick={onClick}>
                <u>CIS Report</u>
              </a>
            </Card>
          </div>
        </div>
      </SignInStyleWrapper>
    </div>
  );
}
