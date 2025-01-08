import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../../redux/slices/authSlice";
import { doLogin } from "../../services/auth";
import FormWrapper from "../../components/Atoms/FormWrapper";
import FormInput from "../../components/Atoms/FormInput";
import useToken from "../../hooks/useToken";

const LoginPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { authenticated } = useSelector((state) => state.auth);
  const { setToken } = useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (authenticated) {
      state?.from ? navigate(state.from) : navigate("/");
    }
  }, [authenticated, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await doLogin({ email: mail, password });
      setToken(data.accessToken);
      dispatch(setAuthenticated(true));
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred on the server.");
      } else if (error.message) {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };


  return (
    <>
      <Toaster />
      <FormWrapper
        formTitle="Admin Control Panel"
        formDescription="Please login to access your admin dashboard."
        formFields={
          <>
            <FormInput id="username" type="text" placeholder="Username" onChange={(e) => setMail(e.target.value)} />
            <FormInput id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </>
        }
        formSubmitButtonText="Login"
        formLink="/register"
        formButton="Register"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default LoginPage;
