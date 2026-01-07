import { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { ROUTE_NAMES, TOAST_TYPES } from "@/components/utils/constant";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, showToast } from "@/store/appSlice";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector((state) => state.app.isLoading);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState("");

  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };

  const validateForm = () => {
    const isNameError = name.length < 3;
    const isUsernameError = username.length < 3;
    const isEmailError = !/\S+@\S+\.\S+/.test(email);
    const isPasswordError = password.length < 6;

    setNameError(isNameError);
    setUsernameError(isUsernameError);
    setEmailError(isEmailError);
    setPasswordError(isPasswordError);

    return !(isNameError || isUsernameError || isEmailError || isPasswordError);
  };

  const register = async () => {
    if (!validateForm()) {
      setErrorMessage("Please correct the errors above.");
      return;
    }

    try {
      dispatch(setLoading(true));

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      dispatch(
        showToast({
          message: "Successfully registered",
          type: TOAST_TYPES.SUCCESS,
        })
      );

      navigate(ROUTE_NAMES.LOGIN);
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error(error.code, error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isLoading) return null;

  return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Create an Account
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none ${
            nameError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {nameError && (
          <p className="text-red-600 text-sm mt-1">
            Name should be at least 3 characters
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Username<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none ${
            usernameError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {usernameError && (
          <p className="text-red-600 text-sm mt-1">
            Username should be at least 3 characters
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none ${
            emailError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {emailError && (
          <p className="text-red-600 text-sm mt-1">Invalid email format</p>
        )}
      </div>

      {/* Contact Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Contact Number
        </label>
        <input
          type="text"
          placeholder="Your Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Password<span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none ${
            passwordError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {passwordError && (
          <p className="text-red-600 text-sm mt-1">
            Password should be at least 6 characters
          </p>
        )}
      </div>

      {/* Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-24 h-24 mt-2 object-cover rounded-md"
          />
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}

      <button
        onClick={register}
        className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
      >
        Register
      </button>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link
          to={ROUTE_NAMES.LOGIN}
          className="text-indigo-600 hover:underline"
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
