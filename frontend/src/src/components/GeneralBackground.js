import React from "react";
import { Box, useTheme } from "@mui/material";

import redLeaves from "../assets/RedLeaves.png";

const GeneralBackground = ({ children, type }) => {
	const theme = useTheme();

	if (type === "login") {
		return (
			<Box
				sx={{
					background: `url(${redLeaves})`,
					backgroundSize: "cover",
					height: "100%",
					width: "100%",
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					overflow: "auto",
					zIndex: 0,
				}}
			>
				{children}
			</Box>
		);
	} else {
		return (
			<Box
				sx={{
					background: `white`,
					height: "100%",
					width: "100%",
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					overflow: "auto",
					zIndex: 0,
				}}
			>
				{children}
			</Box>
		);
	}
};

export default GeneralBackground;
