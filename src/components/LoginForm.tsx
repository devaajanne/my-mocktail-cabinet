import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebaseConfig";

import type { LoginData } from "../types/LoginData";

const LoginForm: React.FC = () => {
  const navigateTo = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        alert("Logged in");
        navigateTo("/home");
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        alert("Account created");
        setIsLogin(true);
      }
      reset();
    } catch (error: any) {
      alert(error.message);
      reset();
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Log in to My Mocktail Cabinet" : "Sign up to My Mocktail Cabinet"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input type='email' {...register("email", { required: "Email is required" })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type='password' {...register("password", { required: "Password is required" })} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type='submit' disabled={isSubmitting} style={{ margin: "10px" }}>
          {isSubmitting ? (isLogin ? "Logging in" : "Signing up") : isLogin ? "Login" : "Sign up"}
        </button>
      </form>

      <p>
        {isLogin ? "Create an account" : "Already have an account?"}
        <br />
        <button onClick={() => setIsLogin(!isLogin)} style={{ margin: "10px" }}>
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
