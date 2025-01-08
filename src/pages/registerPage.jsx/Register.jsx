import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { doRegister } from "../../services/auth";
import FormWrapper from "../../components/Atoms/FormWrapper";
import FormInput from "../../components/Atoms/FormInput";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const RegisterPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { authenticated } = useSelector((state) => state.auth);
  const { state } = useLocation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  useEffect(() => {
    if (authenticated) {
      state?.from ? navigate(state.from) : navigate("/");
    }
  }, [authenticated, state]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(
        { email: mail, password, confirmPassword },
        { abortEarly: false }
      );

      await doRegister({ email: mail, password });
      toast.success("Registration successful!"); 
      navigate("/login");
    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error(error.response?.data?.message || "Registration failed.");
      }
    }
  };

  return (
    <>
      <Toaster />
      <FormWrapper
        formTitle="Admin Registration"
        formDescription="Create a new admin account."
        formFields={
          <>
            <FormInput
              id="username"
              type="text"
              placeholder="Username"
              onChange={(e) => setMail(e.target.value)}
            />
            <FormInput
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormInput
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        }
        formSubmitButtonText="Register"
        formLink="/login"
        formButton="Login"
        onSubmit={handleRegisterSubmit}
      />
    </>
  );
};

export default RegisterPage;
