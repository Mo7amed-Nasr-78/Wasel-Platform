import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useProps } from "./components/PropsProvider";
import { privateHttpClient } from "./api/client/HttpClient";
import { useNotification } from "./components/NotificationContext";
// Auth Pages
import Account from "./pages/auth/Account";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// App Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Shipments from "./pages/Shipments";
import NewShipment from "./pages/NewShipment";
import NotFound from "./pages/NotFound";
import OneTimePassword from "./pages/auth/OneTimePassword";
import Shipment from "./pages/Shipment";
import DashLayout from "./pages/dashboard/DashLayout";
import DashHome from "./pages/dashboard/DashHome";
import DashShipments from "./pages/dashboard/DashShipments";
import DashShipmentOffers from "./pages/dashboard/DashShipmentOffers";
import HasAccess from "./components/HasAccess";
import DashShipmentEdit from "./pages/dashboard/DashShipmentEdit";
import DashOffers from "./pages/dashboard/DashOffers";
// External Libraries
import "./i18n";
import { isAxiosError } from "axios";
// Custom hooks
import { useTranslation } from "react-i18next";
import { useRefresh } from "./api/hooks/auth/useRefresh";
import { useSignout } from "./api/hooks/auth/useSignout";
import DashDrivers from "./pages/dashboard/DashDrivers";
import DashTrucks from "./pages/dashboard/DashTrucks";
import DashBalance from "./pages/dashboard/DashBalance";
import DashUsers from "./pages/dashboard/DashUsers";
import ProfileEdit from "./pages/ProfileEdit";
import { useCurrentUser } from "./api/hooks/user/useCurrentUser";
import ProtectedRoute from "./components/ProtectedRoute";

const dashboardRoles = [
	"admin",
	"manufacturer",
	"carrier_company",
	"independent_carrier",
] as const;

const noAuthPages = new Set([
	"/account",
	"/signin",
	"/signup",
	"/forgetpassword",
	"/verification",
	"/resetpassword",
]);

const publicRoutes = [
	{ path: "/", element: <Home /> },
	{ path: "/account", element: <Account /> },
	{ path: "/signin", element: <Signin /> },
	{ path: "/signup", element: <Signup /> },
	{ path: "/forgetpassword", element: <ForgetPassword /> },
	{ path: "/resetpassword", element: <ResetPassword /> },
	{ path: "/verification", element: <OneTimePassword /> },
	{ path: "/profile/:username", element: <Profile /> },
	{ path: "/profile/:username/edit", element: <ProfileEdit /> },
	{ path: "/shipments", element: <Shipments /> },
	{ path: "/shipments/:id", element: <Shipment /> },
];

const protectedRoutes = [
	{
		path: "/newShipment",
		element: (
			<ProtectedRoute>
				<NewShipment />
			</ProtectedRoute>
		),
	},
];

const dashboardRoutes = [
	{ path: "", element: <DashHome /> },
	{ path: "shipments", element: <DashShipments /> },
	{ path: "shipments/:shipmentId", element: <DashShipmentOffers /> },
	{ path: "shipments/:shipmentId/edit", element: <DashShipmentEdit /> },
	{ path: "offers", element: <DashOffers /> },
	{ path: "drivers", element: <DashDrivers /> },
	{ path: "trucks", element: <DashTrucks /> },
	{ path: "balance", element: <DashBalance /> },
	{ path: "users", element: <DashUsers /> },
];

function App() {
	const { i18n, t } = useTranslation();
	const { setUser, setIsLoading } = useProps();
	const { addNotification } = useNotification();

	// set signout into httpClient
	const {
		mutate: signout,
	} = useSignout();
	privateHttpClient.setLogoutCallback(signout);

	const {
		data: refreshRes,
		mutate: refresh,
		isError: isRefreshError,
		error: refreshError,
		isSuccess: isRefreshSuccess,
	} = useRefresh();

	const {
		mutate: currentUser,
	} = useCurrentUser();

	useEffect(() => {
		i18n.changeLanguage("ar");
		setIsLoading(true);

		const currentPath = window.location.pathname;
		if (!noAuthPages.has(currentPath)) {
			setIsLoading(true);
			refresh();
		}
	}, []);

	useEffect(() => {
		if (isRefreshSuccess) {
			privateHttpClient.setAccessToken(refreshRes.data);
			currentUser();
		}

		if (isRefreshError) {
			setIsLoading(false);
		}
	}, [isRefreshSuccess, isRefreshError, refreshError]);

	return (
		<Suspense>
			<Routes>
				{publicRoutes.map(({ path, element }) => (
					<Route key={path} path={path} element={element} />
				))}

				{protectedRoutes.map(({ path, element }) => (
					<Route key={path} path={path} element={element} />
				))}

				<Route
					path="/dashboard"
					element={
						<HasAccess role={dashboardRoles}>
							<DashLayout />
						</HasAccess>
					}
				>
					{dashboardRoutes.map(({ path, element }) => (
						<Route
							key={path}
							path={path}
							element={element}
						/>
					))}
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default App;
