import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Backdrop,
	CircularProgress,
	Alert,
	AlertTitle,
	Button,
} from "@mui/material";
import GeneralBackground from "../components/GeneralBackground";

import Auth from "../api/auth";
import ErrorService from "../services/ErrorService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const auth = new Auth();
	const errorService = new ErrorService();

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			const response = await auth.me();
			if (response.status === 200) {
				setUser((await response.json()).user);
			} else if (response.status in errorService.ProfileErrors) {
				setError(errorService.ProfileErrors[response.status]);
			} else {
				setError(response);
			}
			setIsLoading(false);
		};
		fetchUser();
	}, []);

	return (
		<GeneralBackground>
			{isLoading && (
				<CircularProgress
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
					}}
				/>
			)}
			{error && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "stretch",
						height: "100%",
						width: "100%",
						padding: 10,
					}}
				>
					<Alert severity="error" variant="filled">
						<AlertTitle>Ошибка</AlertTitle>
						{error}
					</Alert>
				</Box>
			)}
			{user && (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "start",
						height: "100%",
						width: "100%",
						padding: 10,
					}}
				>
					<Typography sx={{ userselect: "none" }}>{user.name}</Typography>
					<Typography sx={{ userselect: "none" }}>{user.email}</Typography>
					<Button
						color="error"
						onClick={() => {
							auth.logout();
							navigate("/");
						}}
					>
						Выйти
					</Button>
				</Box>
			)}
		</GeneralBackground>
	);
};

export default Profile;
