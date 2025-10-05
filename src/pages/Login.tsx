import { useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/ui/Button";
import { testAccounts } from "../constants/testAccounts";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { loginTestAccount } from "../store/slices/authSlice";
import { type User } from "../constants/types";
// import Logo from '../assets/logo.png'; // You'll need to add this logo

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const dispatch = useAppDispatch();
  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const testAccount = testAccounts.find(
        (account) =>
          account.email === values.email && account.pwd === values.password
      );

      if (testAccount) {
        const transformedUser = {
          email: testAccount.email,
          role: testAccount.role,
          type: testAccount.type,
          username: testAccount.username,
          id: testAccount.id.toString(),
        };

        localStorage.setItem("token", "test-token");
        localStorage.setItem("user", JSON.stringify(transformedUser));
        dispatch(
          loginTestAccount({
            user: transformedUser,
            token: "test-token",
          })
        );

        addToast(`Login successful as ${testAccount.role}!`, "success");
        navigate("/dashboard");
      } else {
        addToast("Invalid credentials", "error");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      addToast(error.response?.data?.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[320px] sm:max-w-[380px] md:max-w-[450px] flex flex-col items-center py-6 px-4 sm:py-8 sm:px-8 md:py-10 md:px-10">
        <div className="flex justify-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">My App</h1>
        </div>
        <div className="w-full border border-gray-300 rounded-xl p-1 sm:p-6 md:p-2 md:px-8 bg-white shadow-sm">
          <h2 className="text-2xl sm:text-3xl md:text-[24px] font-bold text-black text-center mb-1">
            Welcome Back
          </h2>
          <p className="text-center text-black text-sm sm:text-base font-semibold mb-4">
            Please enter your details.
          </p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 focus:outline-none bg-transparent"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash
                          size={16}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                        />
                      ) : (
                        <FaEye
                          size={16}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                        />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white rounded-md h-10 mt-2"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <div className="flex gap-1 items-center justify-center mt-2">
                  <Link
                    to="/register"
                    className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Create An Account
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
