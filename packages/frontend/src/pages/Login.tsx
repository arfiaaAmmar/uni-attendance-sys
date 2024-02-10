import React, { useState, useEffect, useContext, FormEvent } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { authoriseUser, loginAdmin, registerAdmin, setUserSessionData } from "../api/admin-api";
import { AuthContext } from "../stores/AuthContext";
import IMG from "../assets/_assets";
import { FM, PAGES_PATH, STORAGE_NAME } from "shared-library/src/constants";
import { Admin } from "shared-library/src/types";
import { isEmpty } from "radash";

const Login = () => {
  const [type, setType] = useState("login")
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    retypePassword: "",
    rememberMe: false,
  });
  const [registerInfo, setRegisterInfo] = useState<Admin>({
    email: "",
    name: "",
    phone: "",
    password: "",
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const adminLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (isEmpty(loginInfo)) {
      setError(FM.pleaseEnterUsernameAndPassword);
      return;
    }
    try {
      await loginAdmin(
        loginInfo.email,
        loginInfo.password,
        loginInfo.rememberMe
      );
      const { email, name, phone, _id } = (await authoriseUser()) as Admin;
      const userSessionArgs = {
        _id,
        email,
        name,
        phone,
      };
      setUserSessionData(userSessionArgs)
      setUser(userSessionArgs);
      navigate(PAGES_PATH.studentDB);
    } catch (error: any) {
      console.error("Error logging in:", error);
      setError(error);
    }
  };

  const adminRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (isEmpty(loginInfo) || isEmpty(registerInfo)) {
      setError(FM.pleaseFillInAllUserData);
      return;
    }
    if (loginInfo.password !== loginInfo.retypePassword) {
      setError(FM.passwordDidNotMatch);
      return;
    }
    try {
      await registerAdmin({
        email: loginInfo.email,
        password: loginInfo.password,
        name: registerInfo.name,
        phone: registerInfo.phone,
      });
      setSuccess(FM.userRegisterSuccess);
      setType("login");
    } catch (error: any) {
      console.error("Error registering:", error);
      setError(error);
    }
  };

  const toggleFormType = () => {
    setType((prevType) => (prevType === "login" ? "register" : "login"));
    setSuccess("");
    setError("");
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return FM.leavePageConfirmation;
    };

    const handlePopState = () => {
      navigate(PAGES_PATH.login);
    };

    window.onbeforeunload = handleBeforeUnload;
    window.onpopstate = handlePopState;

    return () => {
      window.onbeforeunload = null;
      window.onpopstate = null;
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${IMG.loginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black w-screen h-20">
        <div className="h-full w-max">
          <img
            src={IMG.appIcon}
            alt="website logo"
            className="object-contain w-full h-full"
          />
        </div>
      </div>
      <CssBaseline />
      <div className="w-2/5 h-max text-center bg-neutral-100 rounded-md p-6 mx-auto my-40 bg-opacity-50 backdrop-blur-0">
        <h1 className="text-left font-bold text-2xl mb-8">{type === "login" ? "Login" : "Register"}</h1>
        <input
          required
          placeholder="Email Address"
          onChange={(e: any) =>
            setLoginInfo({ ...loginInfo, email: e.target.value })
          }
          name="email"
          className="rounded-md px-2 py-1 block my-2 w-full"
          autoComplete="email"
          autoFocus
        />
        <input
          required
          name="password"
          placeholder="Password"
          type="password"
          className="rounded-md px-2 py-1 block my-2 w-full"
          onChange={(e: any) =>
            setLoginInfo({ ...loginInfo, password: e.target.value })
          }
          autoComplete="current-password"
        />
        {type === "register" && (
          <>
            <input
              required
              name="name"
              placeholder="Full Name"
              className="rounded-md px-2 py-1 block my-2 w-full"
              onChange={(e: any) =>
                setRegisterInfo({ ...registerInfo, name: e.target.value })
              }
            />
            <input
              required
              name="phone"
              placeholder="Phone Number"
              className="rounded-md px-2 py-1 block my-2 w-full"
              onChange={(e: any) =>
                setRegisterInfo({ ...registerInfo, phone: e.target.value })
              }
            />
          </>
        )}
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              checked={loginInfo.rememberMe}
              onChange={() =>
                setLoginInfo({
                  ...loginInfo,
                  rememberMe: !loginInfo.rememberMe,
                })
              }
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={type === "login" ? adminLogin : adminRegister}
          sx={{
            backgroundColor: "green",
            width: "80%",
          }}
        >
          {type === "login" ? "Login" : "Register"}
        </Button>
        <Button
          variant="text"
          className="font-bold"
          onClick={toggleFormType}
          sx={{ color: "blue", marginTop: 2, }}
        >
          {type === "login" ? "Switch to Register" : "Switch to Login"}
        </Button>
        {success ? (
          <Typography sx={{ color: "green" }}>{success}</Typography>
        ) : (
          <Typography sx={{ color: "red" }}>{error}</Typography>
        )}
      </div>
    </Box>
  );
};

export default Login;
