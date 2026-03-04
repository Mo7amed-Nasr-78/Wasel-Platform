import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useProps } from "./components/PropsProvider";
import { setAccessToken } from "./utils/AxiosInstance";
import { useNotification } from "./components/NotificationContext";
// Auth Pages
import Account from "./auth/Account";
import Signin from "./auth/Signin";
import Signup from "./auth/Signup";
import ForgetPassword from "./auth/ForgetPassword";
import ResetPassword from "./auth/ResetPassword";
// App Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dashboard from "./pages/dashboard/Dashboard";

// External Libraries
import "./i18n";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Shipments from "./pages/Shipments";
import NewShipment from "./pages/NewShipment";
import HasAccess from "./components/HasAccess";
import NotFound from "./pages/NotFound";
import OneTimePassword from "./auth/OneTimePassword";

function App() {
	const { i18n, t } = useTranslation();
  const { setUser } = useProps();
  const { addNotification } = useNotification();

  const refresh = async () => {
    try {
      const { user, accessToken } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {},
        {
          withCredentials: true
        }
      )
      .then(async (res) => {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${res.data}`
            }
          }
        )

        return {
          user: data,
          accessToken: res.data
        }
      });

      setAccessToken(accessToken);
      setUser(user);
    } catch (err) {
      addNotification(
        t(err.message),
        "error",
        5000
      )
    }
  }

  useEffect(() => {
		i18n.changeLanguage("ar");

    const authPages = ["/account", "/signin", "/signup", "/forgetpassword", "/verification", "/resetpassword"];
    const currentPath = window.location.pathname;
    if (!authPages.includes(currentPath)) {
      refresh();
    }
	}, []);

	return (
		<BrowserRouter>
			<Suspense>
				<Routes>
					<Route path="/" element={<Home />}></Route>
          {/* auth */}
          <Route path="/account" element={<Account />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
					<Route path="/forgetpassword" element={<ForgetPassword />}></Route>
					<Route path="/resetpassword" element={<ResetPassword />}></Route>
					<Route path="/verification" element={<OneTimePassword />}></Route>
          {/* Pages */}
          <Route path="/newShipment" element={<NewShipment />} />
          <Route path="/profile/:username" element={<Profile />}></Route>
          <Route path="shipments" element={<Shipments />}></Route>
          {/* Dashoard */}
          <Route path="/dashboard" element={
            <HasAccess role={["admin"]}>
              <Dashboard />
            </HasAccess>
          } />
          {/* Default */}
          <Route path="*" element={<NotFound />}/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
