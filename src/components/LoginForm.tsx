import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";

import type { LoginData } from "../types/LoginData";
import AppDialog from "./AppDialog";

const LoginForm: React.FC = () => {
  const navigateTo = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);

  let buttonText;
  if (isSubmitting) {
    buttonText = isLogin ? "Logging in..." : "Signing up...";
  } else {
    buttonText = isLogin ? "Log in" : "Sign up";
  }

  const onSubmit = async (data: LoginData) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setLoginDialogOpen(true);
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        setSignUpDialogOpen(true);
        setIsLogin(true);
      }
      reset();
    } catch (error: any) {
      alert(error.message);
      reset();
      console.error(`Error: ${error.message}`);
    }
  };

  function handleLoginDialogClose() {
    setLoginDialogOpen(false);
    navigateTo("/home");
  }

  function handleSignUpDialogClose() {
    setSignUpDialogOpen(false);
  }

  return (
    <>
      <AppDialog source={"login"} open={loginDialogOpen} handleDialogClose={handleLoginDialogClose} />
      <AppDialog source={"signup"} open={signUpDialogOpen} handleDialogClose={handleSignUpDialogClose} />
      <Box
        component='section'
        maxWidth={400}
        mx='auto'
        mt={4}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        aria-labelledby='auth-form-title'>
        <Typography id='auth-form-title' variant='h5' gutterBottom>
          {isLogin ? "Log in to My Mocktail Cabinet" : "Sign up to My Mocktail Cabinet"}
        </Typography>
      </Box>

      <Box maxWidth={400} mx='auto' mt={2}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label='Email'
              type='email'
              fullWidth
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
              aria-required='true'
            />

            <TextField
              label='Password'
              type='password'
              fullWidth
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              aria-required='true'
            />

            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={isSubmitting}
              aria-label={isLogin ? "Log in" : "Sign up"}>
              {buttonText}
            </Button>
          </Stack>
        </form>
      </Box>

      <Box mt={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography>{isLogin ? "Don't have an account yet?" : "Already have an account?"}</Typography>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 1 }}
          aria-label={isLogin ? "Switch to sign up" : "Switch to log in"}>
          {isLogin ? "Sign up" : "Log in"}
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;
