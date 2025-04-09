import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GameMenu from "./pages/GameMenu";
import InMySphere from "./pages/InMySphere";
import Informbureau from "./pages/Informbureau";
import ShowMeMoskow from "./pages/ShowMeMoskow";
import MoskowDutyOfficer from "./pages/MoskowDutyOfficer";
import AppTheme from "./AppTheme";
import PrivateRoute from "./components/PrivateRoute";

const AnimatedRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/game-menu"
					element={
						<PrivateRoute>
							<GameMenu />
						</PrivateRoute>
					}
				/>
				<Route
					path="/in-my-sphere"
					element={
						<PrivateRoute>
							<InMySphere />
						</PrivateRoute>
					}
				/>
				<Route
					path="/informbureau"
					element={
						<PrivateRoute>
							<Informbureau />
						</PrivateRoute>
					}
				/>
				<Route
					path="/show-me-moskow"
					element={
						<PrivateRoute>
							<ShowMeMoskow />
						</PrivateRoute>
					}
				/>
				<Route
					path="/moskow-duty-officer"
					element={
						<PrivateRoute>
							<MoskowDutyOfficer />
						</PrivateRoute>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
};

function App() {
	return (
		<ThemeProvider theme={AppTheme}>
			<CssBaseline>
				<BrowserRouter>
					<AnimatedRoutes />
				</BrowserRouter>
			</CssBaseline>
		</ThemeProvider>
	);
}

export default App;
