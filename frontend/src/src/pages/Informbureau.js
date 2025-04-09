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
	Card,
	CardContent,
	List,
	ListItem,
	ListItemText,
	Divider,
	Fade,
} from "@mui/material";
import { ArrowBack, ExpandMore } from "@mui/icons-material";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";

import road1 from "../assets/Road1.png";
import redHorse from "../assets/RedHorse.png";
import windowImage from "../assets/Window.png";
import infoSign from "../assets/InfoSign.png";
import { useNavigate } from "react-router-dom";
import Auth from "../api/auth";
import Region from "../api/region";

const Informbureau = () => {
	const [user, setUser] = useState(null);
	const [regions, setRegions] = useState([]);
	const [filteredRegions, setFilteredRegions] = useState([]);
	const [visibleRegions, setVisibleRegions] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isRegionsLoading, setIsRegionsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [error, setError] = useState("");
	const [visibleCount, setVisibleCount] = useState(2); // Начинаем с показа 2 регионов
	const regionsPerLoad = 3; // Сколько дополнительных регионов загружать за раз

	const navigate = useNavigate();
	const authRef = useRef(null);
	const regionRef = useRef(null);

	if (authRef.current === null) {
		authRef.current = new Auth();
	}

	if (regionRef.current === null) {
		regionRef.current = new Region();
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

	useEffect(() => {
		async function fetchRegions() {
			if (!isAuthenticated) return;

			setIsRegionsLoading(true);
			try {
				const response = await regionRef.current.getRegions();
				if (response.status === 200) {
					const regionsData = await response.json();
					console.log("Получены данные регионов:", regionsData);
					setRegions(regionsData);
					setFilteredRegions(regionsData);
				} else {
					console.error("Ошибка при получении данных регионов:", response);
				}
			} catch (err) {
				console.error("Ошибка при запросе данных регионов:", err);
			} finally {
				setIsRegionsLoading(false);
			}
		}

		fetchRegions();
	}, [isAuthenticated]);

	// Обновление видимых регионов при изменении отфильтрованных регионов или количества видимых
	useEffect(() => {
		setVisibleRegions(filteredRegions.slice(0, visibleCount));
	}, [filteredRegions, visibleCount]);

	// Загрузка дополнительных регионов
	const loadMoreRegions = () => {
		setIsLoadingMore(true);

		// Имитация задержки загрузки для лучшего пользовательского опыта
		setTimeout(() => {
			setVisibleCount((prevCount) => prevCount + regionsPerLoad);
			setIsLoadingMore(false);
		}, 500);
	};

	// Получение мер поддержки для конкретного региона
	const fetchRegionDetail = async (regionId) => {
		if (!regionId) return;

		try {
			setIsRegionsLoading(true);
			const response = await regionRef.current.getRegion(regionId);
			if (response.status === 200) {
				const supportMeasures = await response.json();
				console.log(
					`Получены меры поддержки для региона ${regionId}:`,
					supportMeasures
				);

				// Обновляем массив регионов, добавляя меры поддержки для текущего региона
				setRegions((prevRegions) =>
					prevRegions.map((region) =>
						region.id === regionId
							? {
									...region,
									support_measures: Array.isArray(supportMeasures)
										? supportMeasures
										: [],
							  }
							: region
					)
				);
			}
		} catch (err) {
			console.error(
				`Ошибка при получении мер поддержки для региона ${regionId}:`,
				err
			);
			setError(
				`Не удалось загрузить меры поддержки для региона. Попробуйте позже.`
			);
		} finally {
			setIsRegionsLoading(false);
		}
	};

	// Фильтрация регионов при изменении поискового запроса
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredRegions(regions);
			return;
		}

		const filtered = regions.filter((region) => {
			// Поиск по имени региона
			if (region.name.toLowerCase().includes(searchQuery.toLowerCase())) {
				return true;
			}

			// Поиск по мерам поддержки, если они есть
			if (region.support_measures) {
				return region.support_measures.some(
					(measure) =>
						(measure.title &&
							measure.title
								.toLowerCase()
								.includes(searchQuery.toLowerCase())) ||
						(measure.description &&
							measure.description
								.toLowerCase()
								.includes(searchQuery.toLowerCase())) ||
						(measure.link &&
							measure.link.toLowerCase().includes(searchQuery.toLowerCase()))
				);
			}

			return false;
		});

		setFilteredRegions(filtered);
		// При поиске сбрасываем количество видимых регионов, чтобы показать все найденные
		setVisibleCount(filtered.length);
	}, [searchQuery, regions]);

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

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
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
									— Получить информационную поддержку в решении административных
									и бытовых вопросов в столичном регионе бойцам, их семьям и
									вынужденным переселенцам
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
							minHeight: "80vh",
						}}
					>
						<Typography
							variant="h2"
							sx={{
								fontFamily: "Highliner",
								marginBottom: 4,
								lineHeight: 0.8,
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
							Региональные инициативы обеспечения ветеранов – участников
							специальной военной операции (СВО), уволенных со службы и членов
							семей погибших
						</Typography>

						<TextField
							label="Поиск по регионам и мерам поддержки"
							variant="outlined"
							value={searchQuery}
							onChange={handleSearchChange}
							sx={{ width: "100%", marginBottom: 4, borderRadius: 20 }}
						/>

						{isRegionsLoading && visibleRegions.length === 0 ? (
							<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
								<CircularProgress />
							</Box>
						) : filteredRegions.length === 0 ? (
							<Typography
								sx={{
									textAlign: "center",
									fontFamily: "TTTravels",
									fontSize: 18,
									my: 4,
								}}
							>
								{searchQuery
									? "По вашему запросу ничего не найдено"
									: "Данные о регионах отсутствуют"}
							</Typography>
						) : (
							<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
								{visibleRegions.map((region, index) => (
									<Fade
										key={region.id}
										in={true}
										timeout={((index % regionsPerLoad) + 1) * 300}
										style={{
											transitionDelay: `${(index % regionsPerLoad) * 150}ms`,
										}}
									>
										<Card
											elevation={3}
											sx={{
												borderRadius: 3,
												overflow: "hidden",
											}}
										>
											<CardContent sx={{ padding: 3 }}>
												<Typography
													variant="h5"
													sx={{
														fontFamily: "TTTravels",
														fontWeight: "bold",
														mb: 2,
														lineHeight: 1.2,
													}}
												>
													{region.name}
												</Typography>

												{!region.support_measures ? (
													<Button
														variant="outlined"
														onClick={() => fetchRegionDetail(region.id)}
														sx={{
															fontFamily: "TTTravels",
															mb: 2,
															textTransform: "none",
														}}
													>
														Загрузить меры поддержки
													</Button>
												) : region.support_measures.length > 0 ? (
													<List sx={{ width: "100%" }}>
														{region.support_measures.map((measure, index) => (
															<React.Fragment key={measure.id || index}>
																<ListItem
																	alignItems="flex-start"
																	sx={{ px: 0 }}
																>
																	<ListItemText
																		primary={
																			<Typography
																				sx={{
																					fontFamily: "TTTravels",
																					fontWeight: "medium",
																					fontSize: 18,
																				}}
																			>
																				{measure.title || "Мера поддержки"}
																			</Typography>
																		}
																		secondary={
																			<Box>
																				<Typography
																					component="span"
																					sx={{
																						fontFamily: "TTTravels",
																						mt: 1,
																						color: "text.primary",
																						display: "block",
																					}}
																				>
																					{measure.description ||
																						"Нет описания"}
																				</Typography>
																				{measure.link && (
																					<Typography
																						component="a"
																						href={measure.link}
																						target="_blank"
																						rel="noopener noreferrer"
																						sx={{
																							fontFamily: "TTTravels",
																							mt: 1,
																							color: "primary.main",
																							display: "block",
																						}}
																					>
																						Подробнее
																					</Typography>
																				)}
																			</Box>
																		}
																		secondaryTypographyProps={{
																			component: "div",
																		}}
																	/>
																</ListItem>
																{index < region.support_measures.length - 1 && (
																	<Divider component="li" />
																)}
															</React.Fragment>
														))}
													</List>
												) : (
													<Typography
														sx={{
															fontFamily: "TTTravels",
															fontStyle: "italic",
														}}
													>
														Нет доступных мер поддержки для данного региона
													</Typography>
												)}
											</CardContent>
										</Card>
									</Fade>
								))}

								{/* Кнопка "Показать еще" */}
								{visibleRegions.length < filteredRegions.length && (
									<Box
										sx={{ display: "flex", justifyContent: "center", my: 3 }}
									>
										<Button
											variant="outlined"
											startIcon={<ExpandMore />}
											onClick={loadMoreRegions}
											disabled={isLoadingMore}
											sx={{
												fontFamily: "TTTravels",
												textTransform: "none",
												px: 4,
											}}
										>
											{isLoadingMore ? (
												<>
													<CircularProgress size={20} sx={{ mr: 1 }} />
													Загрузка...
												</>
											) : (
												`Показать ещё ${Math.min(
													regionsPerLoad,
													filteredRegions.length - visibleRegions.length
												)} регионов`
											)}
										</Button>
									</Box>
								)}
							</Box>
						)}
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

export default Informbureau;
