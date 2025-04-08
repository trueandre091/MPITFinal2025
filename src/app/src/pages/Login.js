import { useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Alert,
	IconButton,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";
import Auth from "../api/auth";
import ErrorService from "../services/ErrorService";

import redHorse from "../assets/RedHorse.png";
import redLine from "../assets/RedLine.png";
import gosUslugiLogo from "../assets/GosUslugi.png";
import { ArrowBack } from "@mui/icons-material";

const Login = () => {
	const [esiaToken, setEsiaToken] = useState("");
	const [error, setError] = useState("");
	const setAndClearError = (error) => {
		setError(error);
		setTimeout(() => {
			setError("");
		}, 3000);
	};

	const theme = useTheme();

	const auth = new Auth();
	const errorService = new ErrorService();

	const login = async () => {
		const response = await auth.login(esiaToken);
		if (response.ok) {
			navigate("/game-menu");
		} else if (response.status in errorService.LoginErrors) {
			setAndClearError(errorService.LoginErrors[response.status]);
		} else {
			setAndClearError(response);
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
							onClick={() => navigate("/register")}
							sx={{
								textAlign: "right",
								display: "block",
								fontFamily: "TTTravels",
								color: "common.black",
								fontSize: 15,
							}}
						>
							Регистрация
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
							Вход в аккаунт
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
								backgroundPosition: `50% 0`,
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
					<Box sx={{ height: "40%" }} />
					<Box display="flex" flexDirection="row" gap={1}>
						<Button
							variant="contained"
							fontFamily="TTTravels"
							onClick={() => {
								login();
							}}
							sx={{
								fontSize: 20,
								whiteSpace: "nowrap",
								width: "100%",
								textTransform: "none",
								color: theme.palette.primary.main,
								backgroundColor: theme.palette.secondary.light,
							}}
						>
							Войти через
							<Box
								sx={{
									backgroundImage: `url(${gosUslugiLogo})`,
									backgroundSize: "contain",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "right",
									width: "100%",
									height: "20px",
									marginTop: "5px",
								}}
							></Box>
						</Button>
					</Box>
					<TextField
						required
						variant="standard"
						label="id пользователя"
						helperText="Введите id, который вы получили в консоли сайта при регистрации (временное решение, для тестирования прототипа)"
						value={esiaToken}
						onChange={(e) => setEsiaToken(e.target.value)}
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

					<Box display="flex" flexDirection="row" gap={2}>
						<Button
							variant="contained"
							fontFamily="TTTravels"
							sx={{ fontSize: 20, textTransform: "none", width: "100%" }}
							onClick={() => navigate("/")}
						>
							Назад
						</Button>
					</Box>
				</Box>
			</PageTransition>
		</GeneralBackground>
	);
};

export default Login;
