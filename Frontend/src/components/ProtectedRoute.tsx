import { useEffect } from "react";
import Loader from "./Loader";
import { useProps } from "./PropsProvider";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useProps();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !user) {
			navigate("/", { replace: true });
		}
	}, [isLoading, user, navigate]);

	if (isLoading) {
		return <Loader />;
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}

export default ProtectedRoute;
