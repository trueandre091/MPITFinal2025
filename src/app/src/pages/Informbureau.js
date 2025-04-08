import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Typography,
	IconButton,
	CircularProgress,
	Snackbar,
	Alert,
	TextField,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";

import road1 from "../assets/Road1.png";
import redHorse from "../assets/RedHorse.png";
import windowImage from "../assets/Window.png";
import infoSign from "../assets/InfoSign.png";
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
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Box
						sx={{
							position: "relative",
							width: "100%",
							height: "100vh",
							marginBottom: 2,
						}}
					>
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
								caretColor: "transparent",
								outline: "none",
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
									Информбюро
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
									 — Получить информационную поддержку в решении
									административных и бытовых вопросов в столичном регионе
									бойцам, их семьям и вынужденным переселенцам
								</Typography>
								<Box
									component="img"
									src={infoSign}
									sx={{
										position: "absolute",
										top: "60%",
										left: "65%",
										width: "auto",
										height: "10%",
										zIndex: 2,
									}}
								/>
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
					</Box>

					<Box
						sx={{
							padding: { xs: 3, md: 6 },
							backgroundColor: "white",
							color: "black",
						}}
					>
						<Typography
							variant="h2"
							sx={{
								fontFamily: "Highliner",
								marginBottom: 4,
								lineHeight: 0.5,
							}}
						>
							Региональные меры поддержки
						</Typography>

						<Typography
							sx={{
								fontFamily: "TTTravels",
								fontSize: 16,
								lineHeight: 1.6,
								marginBottom: 4,
							}}
						>
							Региональные инициативы обеспечения ветеранов – участников
							специальной военной операции (СВО), уволенных со службы и членов
							семей погибших
						</Typography>

						<TextField
							label="Поиск"
							variant="outlined"
							sx={{ width: "100%", marginBottom: 2, borderRadius: 20 }}
						/>

						<Box sx={{ height: 80 }} />
					</Box>
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
