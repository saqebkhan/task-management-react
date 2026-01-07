import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import CaptchaCheck from "./CaptchaCheck";
import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import { RootState } from "@/store/store";
import { setLoading, setAuthUser, showToast } from "@/store/appSlice";

import logo from "../../assets/react.svg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.app.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const validateCaptcha = (value: boolean) => {
    setShowLogin(value);
  };
  const isAuthenticated = useSelector(
    (state: RootState) => state.app.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTE_NAMES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated]);

  const login = async () => {
    try {
      dispatch(setLoading(true));
      setErrorMessage("");

      const credential = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      );

      dispatch(
        setAuthUser({
          id: credential.user.uid,
          name: credential.user.displayName ?? "",
          email: credential.user.email ?? "",
        })
      );

      dispatch(
        showToast({
          message: "Successfully logged in",
          type: TOAST_TYPES.SUCCESS,
        })
      );

      navigate(ROUTE_NAMES.DASHBOARD);
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email");
          break;
        case "auth/user-not-found":
          setErrorMessage("User not found");
          break;
        case "auth/wrong-password":
          setErrorMessage("Wrong password");
          break;
        case "auth/invalid-credential":
          setErrorMessage("Invalid credential");
          break;
        default:
          setErrorMessage(error.message);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isLoading) return null;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center">
          <img
            src={logo}
            alt="Task Manager Logo"
            className="h-16 w-auto mb-4"
          />

          <h2 className="text-4xl font-semibold text-gray-900 mb-6 p-4">
            LogIn
          </h2>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Captcha */}
        <div className="mb-6">
          <CaptchaCheck onCaptchaValidated={validateCaptcha} />
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Actions */}
        <div className="flex flex-col space-y-4">
          <button
            disabled={!showLogin}
            onClick={login}
            className="py-2 px-4 bg-indigo-600 text-white rounded-md disabled:bg-gray-400"
          >
            Login
          </button>

          <button
            onClick={() => navigate(ROUTE_NAMES.REGISTER)}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
