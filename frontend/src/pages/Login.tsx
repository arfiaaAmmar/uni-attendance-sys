import React, { useState, useEffect, useContext, FormEvent } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, CssBaseline, Typography } from "@mui/material";
import { getAdminData, loginAdmin } from "../api/admin-api";
import { AuthContext } from "../context/AuthContext";
import IMG from "../assets/assets";
import { FM, PAGES_PATH, defFeedback } from "@shared-library/constants";
import { Admin } from "@shared-library/types";

const Login = () => {
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [feedback, setFeedback] = useState(defFeedback);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (
      credential.email == "" ||
      credential.password == "" ||
      credential.email.includes(" ") ||
      credential.password.includes(" ")
    ) {
      setFeedback({ ...feedback, error: "Please enter username and password" });
      return;
    }
    try {
      await loginAdmin(credential.email, credential.password);
      const { email, name, phone, _id } = (await getAdminData()) as Admin;
      const userLocalSessionData = {
        _id,
        email,
        name,
        phone,
      };
      sessionStorage.setItem(
        "userSessionData",
        JSON.stringify(userLocalSessionData)
      );
      setUser(userLocalSessionData);
      navigate(PAGES_PATH.studentDB);
    } catch (error: any) {
      console.error("Error logging in:", error);
      setFeedback(error);
    }
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
        <h1 className="text-left">Admin</h1>
        <input
          required
          placeholder="Email Address"
          onChange={(e: any) =>
            setCredential({ ...credential, email: e.target.value })
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
            setCredential({ ...credential, password: e.target.value })
          }
          autoComplete="current-password"
        />
        {/* <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          }
          label="Remember me"
        /> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          // onClick={handleLogin}
          onClick={() => handleLogin}
          sx={{
            backgroundColor: "#E85969",
            width: "80%",
          }}
        >
          Login
        </Button>
        {feedback.success ? (
          <Typography sx={{ color: "green" }}>{feedback.success}</Typography>
        ) : (
          <Typography sx={{ color: "red" }}>{feedback.error}</Typography>
        )}
      </div>
    </Box>
  );
};

export default Login;
