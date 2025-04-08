import React, { useRef, useEffect, useState } from "react";
import GeneralBackground from "../components/GeneralBackground";
import PageTransition from "../components/PageTransition";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Auth from "../api/auth";

import home1 from "../assets/Home1.gif";
import home2 from "../assets/Home2.gif";
import home3 from "../assets/Home3.gif";
import home4 from "../assets/Home4.gif";
import gameBackground from "../assets/GameBackground.png";
import redLine from "../assets/RedLine.png";
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

	return (
		<GeneralBackground>
			<PageTransition>
				<Box>
					<Box
						sx={{
							position: "absolute",
							width: "100%",
							height: "9%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							userselect: "none",
							cursor: "default",
							outline: "none",
							caretColor: "transparent",
						}}
						tabIndex="-1"
					>
						<Box
							component="img"
							src={redLine}
							sx={{ width: "auto", height: "100%" }}
						/>
					</Box>
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
								top: "4%",
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
							<Box
								component="img"
								onClick={() => navigate("/informbureau")}
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
								onClick={() => navigate("/in-my-sphere")}
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
								onClick={() => navigate("/show-me-moskow")}
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
								onClick={() => navigate("/moskow-duty-officer")}
								src={home3}
								sx={{
									position: "absolute",
									width: "auto",
									height: "10%",
									top: "63%",
									left: "51%",
									zIndex: 1,
									userselect: "none",
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
								top: "90%",
								userselect: "none",
								outline: "none",
								caretColor: "transparent",
							}}
							tabIndex="-1"
						>
							<Box
								component="img"
								src={redLine}
								sx={{ width: "auto", height: "100%" }}
							/>
						</Box>
					</Box>
				</Box>
			</PageTransition>
		</GeneralBackground>
	);
};

export default GameMenu;
