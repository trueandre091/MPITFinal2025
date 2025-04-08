import React, { useRef, useEffect, useState } from "react";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";
import { Box, Stack, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Auth from "../api/auth";
import { ArrowBack } from "@mui/icons-material";

import home1 from "../assets/Home1.gif";
import home2 from "../assets/Home2.gif";
import home3 from "../assets/Home3.gif";
import home4 from "../assets/Home4.gif";
import gameBackground from "../assets/GameBackground.png";
import redLine from "../assets/RedLine.png";
import redHorse from "../assets/RedHorse.png";
import redHorseGif from "../assets/RedHorse.gif";
import ExcToMoskow from "../assets/ExcToMoskow.png";
import Informbureau from "../assets/Informbureau.png";
import InMySphere from "../assets/InMySphere.png";
import RealizeMyself from "../assets/RealizeMyself.png";
import ShowMeMoskow from "../assets/ShowMeMoskow.png";
import OrgAndLogSupport from "../assets/OrgAndLogSupport.png";
import MoskowDutyOfficer from "../assets/MoskowDutyOfficer.png";
import GetInfoSupport from "../assets/GetInfoSupport.png";

const GameMenu = () => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [destination, setDestination] = useState("/game-menu");
	const authRef = useRef(null);
	const [isAnimationComplete, setIsAnimationComplete] = useState(false);

	// Состояния для анимации коня
	const [horsePosition, setHorsePosition] = useState({
		left: "65%",
		top: "44%",
		transition: "none",
		transform: "scaleX(1)",
		opacity: 1,
	});
	const [isAnimating, setIsAnimating] = useState(false);

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
				if (response.status !== 200) {
					localStorage.removeItem("token");
					setIsAuthenticated(false);
					navigate("/login");
				} else {
					setIsAuthenticated(true);
				}
			}
		}
		validateToken();
	}, []);

	// Эффект для перехода на нужную страницу после завершения анимации
	useEffect(() => {
		if (isAnimationComplete && destination !== "/game-menu") {
			navigate(destination);
			setIsAnimationComplete(false);
		}
	}, [isAnimationComplete, destination, navigate]);

	// Упрощенная функция для анимации коня
	const animateHorse = (path) => {
		if (isAnimating) return;

		setIsAnimating(true);
		setIsAnimationComplete(false);

		// Начальное положение
		setHorsePosition({
			...horsePosition,
			transition: "none",
			opacity: 1,
			left: "63%",
			top: "41%",
		});

		// Даем время для применения начального стиля без анимации
		setTimeout(() => {
			let points = [];

			switch (path) {
				case "informbureau":
					points = [
						{ left: "63%", top: "35%", transform: "scaleX(1)" },
						{ left: "69%", top: "33%", transform: "scaleX(1)" },
						{ left: "45%", top: "30%", transform: "scaleX(-1)" },
						{ left: "40%", top: "18%", transform: "scaleX(-1)" },
						{ left: "33%", top: "15%", transform: "scaleX(-1)" },
						{ left: "20%", top: "18%", transform: "scaleX(-1)" },
						{ left: "15%", top: "22%", transform: "scaleX(-1)" },
						{ left: "5%", top: "18%", transform: "scaleX(-1)" },
						{ left: "10%", top: "10%", transform: "scaleX(1)" },
					];
					break;
				case "in-my-sphere":
					points = [
						{ left: "63%", top: "35%", transform: "scaleX(1)" },
						{ left: "73%", top: "36%", transform: "scaleX(1)" },
						{ left: "78%", top: "30%", transform: "scaleX(1)" },
						{ left: "60%", top: "30%", transform: "scaleX(-1)" },
						{ left: "66%", top: "25%", transform: "scaleX(-1)" },
					];
					break;
				case "show-me-moskow":
					points = [
						{ left: "57%", top: "46%", transform: "scaleX(-1)" },
						{ left: "57%", top: "50%", transform: "scaleX(-1)" },
						{ left: "48%", top: "53%", transform: "scaleX(-1)" },
						{ left: "40%", top: "54%", transform: "scaleX(-1)" },
						{ left: "25%", top: "55%", transform: "scaleX(-1)" },
						{ left: "10%", top: "56%", transform: "scaleX(-1)" },
						{ left: "11%", top: "54%", transform: "scaleX(1)" },
						{ left: "20%", top: "51%", transform: "scaleX(1)" },
						{ left: "30%", top: "50%", transform: "scaleX(1)" },
						{ left: "25%", top: "40%", transform: "scaleX(-1)" },
					];
					break;
				case "moskow-duty-officer":
					points = [
						{ left: "65%", top: "46%", transform: "scaleX(-1)" },
						{ left: "64%", top: "50%", transform: "scaleX(-1)" },
						{ left: "55%", top: "55%", transform: "scaleX(-1)" },
						{ left: "40%", top: "60%", transform: "scaleX(-1)" },
						{ left: "16%", top: "60%", transform: "scaleX(-1)" },
						{ left: "11%", top: "66%", transform: "scaleX(-1)" },
						{ left: "14%", top: "71%", transform: "scaleX(1)" },
						{ left: "20%", top: "71%", transform: "scaleX(1)" },
						{ left: "40%", top: "74%", transform: "scaleX(1)" },
						{ left: "50%", top: "75%", transform: "scaleX(1)" },
						{ left: "77%", top: "78%", transform: "scaleX(1)" },
						{ left: "66%", top: "65%", transform: "scaleX(-1)" },
					];
					break;
				default:
					points = [{ left: "65%", top: "44%", transform: "scaleX(1)" }];
			}

			// Функция для последовательной анимации по точкам
			let currentPointIndex = 0;

			const moveToNextPoint = () => {
				// Если достигли конца массива точек, завершаем анимацию
				if (currentPointIndex >= points.length) {
					// Скрываем коня
					setHorsePosition((prev) => ({
						...prev,
						opacity: 0,
					}));

					// Завершаем анимацию и устанавливаем флаг для перехода
					setIsAnimating(false);
					setIsAnimationComplete(true);
					return;
				}

				// Задаем новую позицию с анимацией
				setHorsePosition({
					...points[currentPointIndex],
					transition: "all 0.6s ease-in-out",
					opacity: 1,
					zIndex: 10,
				});

				// Увеличиваем индекс для следующей точки
				currentPointIndex++;

				// Вызываем функцию снова через 600мс (время анимации)
				setTimeout(moveToNextPoint, 600);
			};

			// Запускаем анимацию
			moveToNextPoint();
		}, 50);
	};

	// Обработчики нажатия на дома с анимацией
	const handleHome1Click = () => {
		animateHorse("in-my-sphere");
		setDestination("/in-my-sphere");
	};

	const handleHome2Click = () => {
		animateHorse("show-me-moskow");
		setDestination("/show-me-moskow");
	};

	const handleHome3Click = () => {
		animateHorse("moskow-duty-officer");
		setDestination("/moskow-duty-officer");
	};

	const handleHome4Click = () => {
		animateHorse("informbureau");
		setDestination("/informbureau");
	};

	return (
		<GeneralBackground>
			<PageTransition>
				<Box>
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
							outline: "none",
							caretColor: "transparent",
							pointerEvents: "auto",
							WebkitTapHighlightColor: "transparent",
							touchAction: "manipulation",
						}}
						tabIndex="-1"
					>
						<Box
							sx={{
								position: "relative",
								width: "auto",
								height: "100%",
								top: "3%",
								zIndex: 0,
								userselect: "none",
								outline: "none",
								caretColor: "transparent",
							}}
							tabIndex="-1"
						>
							<Box
								component="img"
								src={gameBackground}
								sx={{
									position: "relative",
									width: "120%",
									minWidth: "520px",
									height: "80%",
									top: "8%",
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
							{isAnimating ? (
								<Box
									component="img"
									src={redHorseGif}
									sx={{
										position: "absolute",
										width: "auto",
										height: "7%",
										zIndex: 5,
										...horsePosition,
										userselect: "none",
										pointerEvents: "none",
										filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.3))",
									}}
								/>
							) : (
								<Box
									component="img"
									src={redHorse}
									sx={{
										position: "absolute",
										width: "auto",
										height: "5%",
										zIndex: 5,
										...horsePosition,
										userselect: "none",
										pointerEvents: "none",
										filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
									}}
								/>
							)}
							<Box
								component="img"
								onClick={handleHome4Click}
								src={home4}
								sx={{
									position: "absolute",
									width: "auto",
									height: "10%",
									top: "5%",
									left: "16%",
									zIndex: 1,
									userselect: "none",
									transform: "scaleX(-1)",
									cursor: "pointer",
								}}
							/>
							<Box
								component="img"
								src={Informbureau}
								sx={{
									position: "absolute",
									width: "auto",
									height: "5%",
									top: "14%",
									left: "15%",
									userselect: "none",
									zIndex: 2,
								}}
							/>
							<Box
								component="img"
								src={GetInfoSupport}
								sx={{
									position: "absolute",
									width: "auto",
									height: "5%",
									top: "5%",
									left: "36%",
									zIndex: 2,
									userselect: "none",
								}}
							/>

							<Box
								component="img"
								src={home1}
								onClick={handleHome1Click}
								sx={{
									position: "absolute",
									width: "auto",
									height: "12%",
									top: "18%",
									left: "67%",
									zIndex: 1,
									userselect: "none",
									cursor: "pointer",
								}}
							/>
							<Box
								component="img"
								src={InMySphere}
								sx={{
									position: "absolute",
									width: "auto",
									height: "5%",
									top: "28%",
									left: "50%",
									zIndex: 2,
									userselect: "none",
								}}
							/>
							<Box
								component="img"
								src={RealizeMyself}
								sx={{
									position: "absolute",
									width: "auto",
									height: "4%",
									top: "17%",
									left: "55%",
									zIndex: 2,
									userselect: "none",
								}}
							/>

							<Box
								component="img"
								onClick={handleHome2Click}
								src={home2}
								sx={{
									position: "absolute",
									width: "auto",
									height: "12%",
									top: "34%",
									left: "20%",
									zIndex: 1,
									userselect: "none",
									cursor: "pointer",
								}}
							/>
							<Box
								component="img"
								src={ShowMeMoskow}
								sx={{
									position: "absolute",
									width: "auto",
									height: "7%",
									top: "45%",
									left: "15%",
									zIndex: 1,
									userselect: "none",
								}}
							/>
							<Box
								component="img"
								src={ExcToMoskow}
								sx={{
									position: "absolute",
									width: "auto",
									height: "5%",
									top: "32%",
									left: "14%",
									zIndex: 1,
									userselect: "none",
								}}
							/>

							<Box
								component="img"
								onClick={handleHome3Click}
								src={home3}
								sx={{
									position: "absolute",
									width: "auto",
									height: "10%",
									top: "63%",
									left: "51%",
									zIndex: 1,
									userselect: "none",
									cursor: "pointer",
								}}
							/>
							<Box
								component="img"
								src={MoskowDutyOfficer}
								sx={{
									position: "absolute",
									width: "auto",
									height: "5%",
									top: "71%",
									left: "35%",
									zIndex: 1,
									userselect: "none",
								}}
							/>
							<Box
								component="img"
								src={OrgAndLogSupport}
								sx={{
									position: "absolute",
									width: "auto",
									height: "7%",
									top: "61%",
									left: "65%",
									zIndex: 1,
									userselect: "none",
								}}
							/>
						</Box>
						<Box
							sx={{
								position: "absolute",
								width: "101%",
								height: "9%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								userselect: "none",
								cursor: "default",
								top: "85%",
								userselect: "none",
								outline: "none",
								caretColor: "transparent",
							}}
							tabIndex="-1"
						>
							<IconButton
								onClick={() => navigate("/")}
								disabled={isAnimating}
								sx={{
									position: "absolute",
									top: "0",
									left: "8%",
								}}
							>
								<ArrowBack sx={{ fontSize: 30 }} />
							</IconButton>
						</Box>
					</Box>
				</Box>
			</PageTransition>
		</GeneralBackground>
	);
};

export default GameMenu;
