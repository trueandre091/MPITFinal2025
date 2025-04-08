import React, { useEffect, useState, useRef } from "react";
import {
	Box,
	Typography,
	AppBar,
	Toolbar,
	Stack,
	Button,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";

import redLeaves from "../assets/RedLeaves.png";
import redLine from "../assets/RedLine.png";
import Auth from "../api/auth";

const Home = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const theme = useTheme();
	const navigate = useNavigate();
	const authRef = useRef(null);

	if (authRef.current === null) {
		authRef.current = new Auth();
	}

	useEffect(() => {
		localStorage.removeItem("registrationData");
		console.log("Данные регистрации очищены при загрузке Home");
		async function validateToken() {
			const token = localStorage.getItem("token");
			if (token) {
				const response = await authRef.current.me();
				if (response.status === 401 || response.status === 403) {
					localStorage.removeItem("token");
					setIsAuthenticated(false);
				} else {
					setIsAuthenticated(true);
				}
			}
		}
		validateToken();
	}, []);

	function handleStart() {
		if (isAuthenticated) {
			navigate("/game-menu");
		} else {
			navigate("/login");
		}
	}

	return (
		<GeneralBackground type="home">
			<PageTransition>
				<Stack
					display="flex"
					flexDirection="column"
					justifyContent="space-evenly"
					userselect="none"
					paddingX={4}
					paddingY={4}
				>
					<Box display="flex" flexDirection="column" gap={5}>
						<Typography
							align="start"
							color="common.black"
							fontWeight={500}
							lineHeight={0.6}
							fontSize={130}
							letterSpacing={8}
							paddingY={2}
							fontFamily="Highliner"
						>
							Позывной:
							<br />
							Дом
						</Typography>
						<Box
							sx={{
								background: `url(${redLine})`,
								width: "100%",
								height: "80px",
								backgroundRepeat: "no-repeat",
								backgroundSize: "contain",
								backgroundPosition: "center",
							}}
						></Box>
						<Box display="flex" flexDirection="column" gap={1.5}>
							<Typography
								fontWeight={300}
								lineHeight={1.2}
								fontSize={22}
								fontFamily="TTTravels"
							>
								— Поддержка героев - участников СВО
							</Typography>
							<Typography
								fontWeight={300}
								lineHeight={1.2}
								fontSize={22}
								fontFamily="TTTravels"
							>
								— Связь с людьми, готовыми помочь
							</Typography>
							<Typography
								fontWeight={300}
								lineHeight={1.2}
								fontSize={22}
								fontFamily="TTTravels"
							>
								— Консультации по обучению и трудоустройству
							</Typography>
							<Typography
								fontWeight={300}
								lineHeight={1.2}
								fontSize={22}
								fontFamily="TTTravels"
							>
								— Помощь в адаптации
							</Typography>
							<Typography
								fontWeight={300}
								lineHeight={1.2}
								fontSize={22}
								fontFamily="TTTravels"
							>
								— Экскурсии по столице России и многое другое
							</Typography>
						</Box>
						<Box paddingTop={2} display="flex" justifyContent="space-evenly">
							<Button
								variant="contained"
								onClick={handleStart}
								sx={{
									width: "100%",
									fontFamily: "TTTravels",
									fontSize: "30px",
									fontWeight: "300",
									letterSpacing: "5px",
									borderRadius: "25px",
									padding: "10px 40px",
									backgroundColor: theme.palette.primary.main,
									color: theme.palette.common.white,
								}}
							>
								Начать
							</Button>
						</Box>
					</Box>

					<Box height={50} />

					<Box display="flex" flexDirection="column" gap={3}>
						<Typography
							align="start"
							color="common.black"
							fontWeight={500}
							lineHeight={0.8}
							fontSize={130}
							letterSpacing={8}
							sx={{ userselect: "none" }}
							fontFamily="Highliner"
						>
							Статистика
						</Typography>
						<Box
							display="flex"
							flexDirection="column"
							gap={0.5}
							backgroundColor="secondary.light"
							padding={1}
							position="relative"
							borderRadius="25px"
						>
							<Box
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									zIndex: 0,
									overflow: "hidden",
								}}
							>
								<Box
									sx={{
										position: "absolute",
										top: "10%",
										right: "-13%",
										width: "70%",
										height: "70%",
										background: `url(${redLeaves})`,
										backgroundRepeat: "no-repeat",
										backgroundSize: "contain",
										backgroundPosition: "center",
										transform: "scaleX(-1)",
									}}
								/>
							</Box>
							<Box zIndex={1}>
								<Typography
									align="end"
									fontWeight={500}
									lineHeight={0.7}
									letterSpacing={8}
									fontSize={200}
									sx={{ userselect: "none", color: "common.black" }}
									fontFamily="Highliner"
								>
									199001
								</Typography>
								<Typography
									align="end"
									fontWeight={400}
									lineHeight={1.2}
									fontSize={20}
									fontFamily="TTTravels"
									paddingY={2}
									paddingX={1}
									sx={{ userselect: "none", color: "primary.main" }}
								>
									Количество участников
								</Typography>
							</Box>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							gap={0.5}
							backgroundColor="secondary.light"
							padding={1}
							position="relative"
							borderRadius="25px"
						>
							<Box
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									zIndex: 0,
									overflow: "hidden",
								}}
							>
								<Box
									sx={{
										position: "absolute",
										top: "10%",
										right: "-13%",
										width: "70%",
										height: "70%",
										background: `url(${redLeaves})`,
										backgroundRepeat: "no-repeat",
										backgroundSize: "contain",
										backgroundPosition: "center",
										transform: "scaleX(-1)",
									}}
								/>
							</Box>
							<Box zIndex={1}>
								<Typography
									align="end"
									fontWeight={500}
									lineHeight={0.7}
									letterSpacing={8}
									fontSize={200}
									sx={{ userselect: "none", color: "common.black" }}
									fontFamily="Highliner"
								>
									199001
								</Typography>
								<Typography
									align="end"
									fontWeight={400}
									lineHeight={1.2}
									fontSize={20}
									fontFamily="TTTravels"
									paddingY={2}
									paddingX={1}
									sx={{ userselect: "none", color: "primary.main" }}
								>
									Количество участников
								</Typography>
							</Box>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							gap={0.5}
							backgroundColor="secondary.light"
							padding={1}
							position="relative"
							borderRadius="25px"
						>
							<Box
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									zIndex: 0,
									overflow: "hidden",
								}}
							>
								<Box
									sx={{
										position: "absolute",
										top: "10%",
										right: "-13%",
										width: "70%",
										height: "70%",
										background: `url(${redLeaves})`,
										backgroundRepeat: "no-repeat",
										backgroundSize: "contain",
										backgroundPosition: "center",
										transform: "scaleX(-1)",
									}}
								/>
							</Box>
							<Box zIndex={1}>
								<Typography
									align="end"
									fontWeight={500}
									lineHeight={0.7}
									letterSpacing={8}
									fontSize={200}
									sx={{ userselect: "none", color: "common.black" }}
									fontFamily="Highliner"
								>
									199001
								</Typography>
								<Typography
									align="end"
									fontWeight={400}
									lineHeight={1.2}
									fontSize={20}
									fontFamily="TTTravels"
									paddingY={2}
									paddingX={1}
									sx={{ userselect: "none", color: "primary.main" }}
								>
									Количество участников
								</Typography>
							</Box>
						</Box>
					</Box>
				</Stack>
			</PageTransition>
		</GeneralBackground>
	);
};

export default Home;
