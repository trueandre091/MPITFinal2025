import { useState, useEffect } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Alert,
	useTheme,
	IconButton,
	Fade,
	Slide,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";

import redLine from "../assets/RedLine.png";
import redHorse from "../assets/RedHorse.png";
import gosUslugiLogo from "../assets/GosUslugi.png";

import Auth from "../api/auth";
import ErrorService from "../services/ErrorService";

const Login = () => {
	const [name, setName] = useState("");
	const [esiaToken, setEsiaToken] = useState("");
	const [category, setCategory] = useState("");
	const [error, setError] = useState("");
	const [question, setQuestion] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);

	const setAndClearError = (error) => {
		console.log("Ошибка:", error);
		setError(error);
		setTimeout(() => {
			setError("");
		}, 3000);
	};

	const theme = useTheme();

	const auth = new Auth();
	const errorService = new ErrorService();

	useEffect(() => {
		try {
			const savedData = localStorage.getItem("registrationData");

			if (savedData) {
				const parsedData = JSON.parse(savedData);

				setName(parsedData.name || "");
				setEsiaToken(parsedData.esiaToken || "");
				setCategory(parsedData.category || "");
				setQuestion(parsedData.question || 0);
			}
			setIsLoaded(true);
		} catch (error) {
			console.error("Ошибка при загрузке данных:", error);
			setIsLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (!isLoaded) return;

		try {
			const dataToSave = {
				name,
				esiaToken,
				category,
				question,
			};
			localStorage.setItem("registrationData", JSON.stringify(dataToSave));
		} catch (error) {
			console.error("Ошибка при сохранении данных:", error);
		}
	}, [name, esiaToken, category, question, isLoaded]);

	const clearSavedData = () => {
		localStorage.removeItem("registrationData");
		console.log("Данные регистрации очищены");
	};

	const handleNextQuestion = async () => {
		console.log("Переход к следующему вопросу. Текущий этап:", question);
		if (question === 0) {
			if (name.length < 3 || name.length > 20) {
				setAndClearError("Имя должно быть не менее 3 символов и не более 20");
				return;
			} else {
				console.log("Имя прошло валидацию");
				setQuestion(question + 50);
			}
		} else if (question === 50) {
			if (category === "") {
				setAndClearError("Выберите категорию");
				return;
			} else {
				console.log("Категория выбрана");
				setQuestion(question + 50);
			}
		} else if (question === 100) {
			// if (esiaToken === "") {
			// 	setAndClearError("Необходимо пройти систему ЕСИА (Госуслуги)");
			// 	return;
			// } else {
			// 	console.log("Токен ЕСИА прошел валидацию");
			// 	setQuestion(question + 50);
			// }

			// ВРЕМЕННОЕ РЕШЕНИЕ
			register();
		}
	};

	const handleBackQuestion = () => {
		if (question === 0) {
			navigate("/");
			localStorage.removeItem("registrationData");
		} else {
			setQuestion(Math.max(question - 50, 0));
		}
	};

	const selectCategory = (selectedCategory) => {
		console.log("Выбрана категория:", selectedCategory);
		setCategory(selectedCategory);
		if (question === 50 && selectedCategory !== "") {
			setQuestion(question + 50);
		}
	};

	const _generateRandomEsiaToken = () => {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const length = 16;
		return Array.from({ length }, () =>
			characters.charAt(Math.floor(Math.random() * characters.length))
		).join("");
	};

	const register = async () => {
		console.log("Отправка данных регистрации");
		// TODO: ВРЕМЕННОЕ РЕШЕНИЕ
		const esiaToken = _generateRandomEsiaToken();
		const response = await auth.register(esiaToken, name, category);
		if (response.ok) {
			console.log("Регистрация успешна");
			clearSavedData();
			navigate("/game-menu");
		} else if (response.status in errorService.RegisterErrors) {
			console.log(
				"Ошибка регистрации:",
				errorService.RegisterErrors[response.status]
			);
			setAndClearError(errorService.RegisterErrors[response.status]);
		} else {
			console.log("Неизвестная ошибка регистрации");
			setAndClearError(
				"Неизвестная ошибка при регистрации. Пожалуйста, попробуйте позже."
			);
		}
	};

	const navigate = useNavigate();

	return (
		<GeneralBackground>
			<PageTransition>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "start",
						height: "40%",
						padding: 4,
						gap: 2,
					}}
				>
					<Box
						sx={{
							width: "100%",
							display: "flex",
							justifyContent: "end",
						}}
					>
						<Button
							variant="text"
							fontFamily="TTTravels"
							onClick={() => navigate("/login")}
							sx={{
								textAlign: "right",
								display: "block",
								fontFamily: "TTTravels",
								color: "common.black",
								fontSize: 15,
							}}
						>
							Войти
						</Button>
					</Box>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "start",
							justifyContent: "center",
							userselect: "none",
						}}
					>
						<Typography variant="h1" fontFamily="Highliner">
							Регистрация
						</Typography>
					</Box>
					<Box
						sx={{
							position: "relative",
							height: "100%",
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
						color="common.black"
					>
						<Box
							sx={{
								position: "relative",
								width: "100%",
								height: "35%",
								background: `url(${redHorse})`,
								backgroundRepeat: "no-repeat",
								backgroundSize: "contain",
								backgroundPosition: `${question === 100 ? 100 : question}% 0`,
								zIndex: 0,
								transition: "background-position 0.8s ease-in-out",
							}}
						></Box>
						<Box
							sx={{
								position: "relative",
								width: "100%",
								height: "100%",
								background: `url(${redLine})`,
								backgroundRepeat: "no-repeat",
								backgroundSize: "contain",
								backgroundPosition: "center",
								zIndex: 1,
								marginTop: "-104px",
							}}
						></Box>
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "stretch",
						justifyContent: "space-evenly",
						minHeight: "60%",
						width: "100%",
						borderRadius: 10,
						padding: 4,
					}}
					userselect="none"
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							height: "10%",
						}}
					>
						{error && (
							<Alert
								severity="error"
								variant="outlined"
								onClose={() => setError("")}
							>
								{error}
							</Alert>
						)}
					</Box>
					<Fade key={`question-title-${question}`} in={true} timeout={500}>
						<Box>
							<Typography fontFamily="TTTravels" fontSize={20}>
								{question === 0
									? "Начнём с основ: как вас звать?"
									: question === 50
									? "Выберите, к какой категории вы относитесь:"
									: question === 100
									? "Нам нужно быть уверенными в том, что вы не мошенник. Пройдите систему ЕСИА (Госуслуги)"
									: ""}
							</Typography>
						</Box>
					</Fade>
					<Fade key={`question-content-${question}`} in={true} timeout={500}>
						<Box>
							{question === 0 ? (
								<TextField
									required
									variant="standard"
									label="Имя (позывной)"
									helperText="Это имя будут видеть пользователи"
									value={name}
									onChange={(e) => setName(e.target.value)}
									sx={{
										width: "100%",
										"& .MuiFormHelperText-root": {
											fontSize: "14px",
											fontFamily: "TTTravels",
										},
										"& .MuiInputBase-input": {
											fontSize: "25px",
											fontFamily: "TTTravels",
										},
									}}
								/>
							) : question === 50 ? (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										gap: 2,
									}}
								>
									<Button
										variant="contained"
										fontFamily="TTTravels"
										onClick={() => selectCategory("Боец")}
										sx={{
											fontSize: 20,
											textTransform: "none",
											color: theme.palette.primary.main,
											backgroundColor: theme.palette.secondary.light,
										}}
									>
										Боец
									</Button>
									<Button
										variant="contained"
										fontFamily="TTTravels"
										onClick={() => selectCategory("Член семьи СВО")}
										sx={{
											fontSize: 20,
											textTransform: "none",
											color: theme.palette.primary.main,
											backgroundColor: theme.palette.secondary.light,
										}}
									>
										Член семьи СВО
									</Button>
									<Button
										variant="contained"
										fontFamily="TTTravels"
										onClick={() => selectCategory("Переселенец")}
										sx={{
											fontSize: 20,
											textTransform: "none",
											color: theme.palette.primary.main,
											backgroundColor: theme.palette.secondary.light,
										}}
									>
										Переселенец
									</Button>
									<Button
										variant="contained"
										fontFamily="TTTravels"
										sx={{
											fontSize: 20,
											textTransform: "none",
											width: "100%",
											marginTop: "10%",
										}}
										onClick={handleBackQuestion}
									>
										Назад
									</Button>
								</Box>
							) : (
								question === 100 && (
									<Button
										variant="contained"
										fontFamily="TTTravels"
										onClick={() => {
											handleNextQuestion();
										}}
										sx={{
											fontSize: 20,
											width: "100%",
											textTransform: "none",
											color: theme.palette.primary.main,
											backgroundColor: theme.palette.secondary.light,
										}}
									>
										Подключить
										<Box
											sx={{
												backgroundImage: `url(${gosUslugiLogo})`,
												backgroundSize: "contain",
												backgroundRepeat: "no-repeat",
												backgroundPosition: "end",
												width: "100%",
												height: "30px",
												marginTop: "5px",
											}}
										></Box>
									</Button>
								)
							)}
						</Box>
					</Fade>
					<Box height="10%"></Box>
					<Fade key={`question-buttons-${question}`} in={true} timeout={500}>
						<Box display="flex" flexDirection="row" gap={2}>
							{question === 0 ? (
								<>
									<IconButton
										variant="contained"
										fontFamily="TTTravels"
										sx={{ fontSize: 20, textTransform: "none" }}
										onClick={handleBackQuestion}
									>
										<ArrowBack sx={{ fontSize: 30 }} />
									</IconButton>
									<Button
										variant="contained"
										fontFamily="TTTravels"
										sx={{ fontSize: 20, textTransform: "none", width: "100%" }}
										onClick={handleNextQuestion}
									>
										Далее
									</Button>
								</>
							) : (
								question === 100 && (
									<>
										{esiaToken !== "" ? (
											<>
												<IconButton
													variant="contained"
													fontFamily="TTTravels"
													sx={{ fontSize: 20, textTransform: "none" }}
													onClick={handleBackQuestion}
												>
													<ArrowBack sx={{ fontSize: 30 }} />
												</IconButton>
												<Button
													variant="contained"
													fontFamily="TTTravels"
													sx={{
														fontSize: 20,
														textTransform: "none",
														width: "100%",
													}}
													onClick={handleNextQuestion}
												>
													Получить помощь
												</Button>
											</>
										) : (
											<Button
												variant="contained"
												fontFamily="TTTravels"
												sx={{
													fontSize: 20,
													textTransform: "none",
													width: "100%",
												}}
												onClick={handleBackQuestion}
											>
												Назад
											</Button>
										)}
									</>
								)
							)}
						</Box>
					</Fade>
				</Box>
			</PageTransition>
		</GeneralBackground>
	);
};

export default Login;
