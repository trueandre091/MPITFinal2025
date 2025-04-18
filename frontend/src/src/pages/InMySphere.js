import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Typography,
	IconButton,
	CircularProgress,
	Snackbar,
	Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";

import road1 from "../assets/Road1.png";
import redHorse from "../assets/RedHorse.png";
import windowImage from "../assets/Window.png";
import { useNavigate } from "react-router-dom";
import Auth from "../api/auth";

const InMySphere = () => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const authRef = useRef(null);

	if (authRef.current === null) {
		authRef.current = new Auth();
	}

	useEffect(() => {
		async function validateToken() {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await authRef.current.me();
					if (response.status === 401 || response.status === 403) {
						localStorage.removeItem("token");
						navigate("/login");
					} else {
						setIsAuthenticated(true);
						const userData = await response.json();
						setUser(userData.user);
					}
				} catch (err) {
					console.error("Ошибка при проверке токена:", err);
					localStorage.removeItem("token");
					navigate("/login");
				}
			} else {
				navigate("/login");
			}
		}
		validateToken();
	}, [navigate]);

	const handleRequest = async () => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		if (!user || !user.id) {
			setError(
				"Информация о пользователе недоступна. Пожалуйста, попробуйте перезагрузить страницу."
			);
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const response = await authRef.current.bot();
			if (response.status === 200) {
				const data = await response.json();
				if (data && data.bot && data.bot.username) {
					window.open(
						`https://t.me/${data.bot.username}?start=${user.id}`,
						"_blank"
					);
				} else {
					setError("Не удалось получить данные бота.");
				}
			} else {
				const errorData = await response.json().catch(() => ({}));
				setError(
					errorData.message ||
						"Не удалось выполнить запрос. Пожалуйста, попробуйте позже."
				);
				console.log("Ошибка запроса:", errorData);
			}
		} catch (err) {
			setError("Произошла ошибка при соединении с сервером.");
			console.error("Ошибка запроса:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseError = () => {
		setError("");
	};

	return (
		<GeneralBackground>
			<PageTransition>
				<Box
					sx={{
						position: "absolute",
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						userselect: "none",
						cursor: "default",
						overflow: "hidden",
					}}
					tabIndex="-1"
				>
					<Box
						sx={{
							position: "relative",
							width: "auto",
							height: "100%",
							top: "4%",
							zIndex: 0,
						}}
						tabIndex="-1"
					>
						<Box
							component="img"
							src={road1}
							sx={{
								position: "relative",
								width: "130%",
								minWidth: "520px",
								height: "90%",
								top: "2%",
								left: "50%",
								transform: {
									xs: "translateX(-50%) scaleX(1)",
									sm: "translateX(-50%) scaleX(1.3)",
								},
								zIndex: 0,
								userselect: "none",
								pointerEvents: "none",
								objectFit: "contain",
								transition: "transform 0.3s ease",
								transformOrigin: "center",
								caretColor: "transparent",
							}}
							tabIndex="-1"
						/>
						<Box
							component="img"
							src={redHorse}
							sx={{
								position: "absolute",
								top: "70%",
								left: "13%",
								width: "auto",
								height: "13%",
								zIndex: 2,
							}}
						/>
						<Box
							component="img"
							src={windowImage}
							sx={{
								position: "absolute",
								width: "auto",
								height: "78%",
								top: "1%",
								left: "50%",
								transform: {
									xs: "translateX(-50%) scaleX(1)",
									sm: "translateX(-50%) scaleX(1.3)",
								},
								zIndex: 0,
								userselect: "none",
								pointerEvents: "none",
								objectFit: "contain",
								transition: "transform 0.3s ease",
								transformOrigin: "center",
							}}
							tabIndex="-1"
						/>
						<Typography
							variant="h1"
							sx={{
								fontFamily: "Highliner",
								fontSize: 110,
								letterSpacing: 4,
								position: "absolute",
								top: "22%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								color: "common.white",
								zIndex: 3,
								whiteSpace: "nowrap",
								minWidth: "max-content",
							}}
						>
							В СВОей сфере
						</Typography>
						<Typography
							variant="h1"
							sx={{
								fontSize: 22,
								letterSpacing: 0.2,
								lineHeight: 1.1,
								position: "absolute",
								top: "47%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								color: "common.white",
								zIndex: 3,
								width: "60%",
								textAlign: "start",
							}}
						>
							— Поможем определиться с выбором направления самореализации
							бойцам, возвращающимся с СВО – от учёбы до работы и творчества,
							расскажем о своей сфере деятельности и проконсультируем о
							возможностях учёбы и трудоустройства
						</Typography>
					</Box>
					<IconButton
						variant="contained"
						fontFamily="TTTravels"
						sx={{
							fontSize: 20,
							textTransform: "none",
							position: "absolute",
							bottom: "5%",
							left: "5%",
						}}
						onClick={() => {
							navigate("/game-menu");
						}}
					>
						<ArrowBack sx={{ fontSize: 30 }} />
					</IconButton>
					<Button
						variant="contained"
						fontFamily="TTTravels"
						disabled={isLoading}
						sx={{
							fontSize: 20,
							textTransform: "none",
							width: "70%",
							position: "absolute",
							bottom: "5%",
							left: "20%",
						}}
						onClick={handleRequest}
					>
						{isLoading ? (
							<CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
						) : null}
						Получить консультацию
					</Button>
				</Box>
				<Snackbar
					open={!!error}
					autoHideDuration={6000}
					onClose={handleCloseError}
				>
					<Alert
						onClose={handleCloseError}
						severity="error"
						sx={{ width: "100%" }}
					>
						{error}
					</Alert>
				</Snackbar>
			</PageTransition>
		</GeneralBackground>
	);
};

export default InMySphere;
