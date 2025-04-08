import { createTheme } from "@mui/material";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/200.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto/700.css";

const AppTheme = createTheme({
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					height: "100px",
					boxShadow: "0 0 0 0",
					elevation: 0,
				},
			},
		},
	},
	palette: {
		common: {
			black: "#000000",
			white: "#ffffff",
		},
		primary: {
			main: "#900604", //"#637755",
			light: "#D79191",
			dark: "#555A78",
		},
		secondary: {
			main: "#6D714F",
			light: "#EAE7D6",
			dark: "#365378",
		},
	},
	typography: {
		fontFamily: "TTTravels",
		h1: {
			fontSize: "130px",
			fontWeight: 400,
			lineHeight: 0.3,
			letterSpacing: 0.05,
		},
		h2: {
			fontSize: "100px",
			fontWeight: 400,
			lineHeight: 0.3,
			letterSpacing: 0.05,
		},
		h3: {
			fontSize: "80px",
			fontWeight: 400,
			lineHeight: 0.3,
			letterSpacing: 0.05,
		},
		h4: {
			fontSize: "60px",
			fontWeight: 400,
			lineHeight: 0.3,
			letterSpacing: 0.05,
		},
		h5: {
			fontSize: "40px",
			fontWeight: 400,
			lineHeight: 0.3,
			letterSpacing: 0.05,
		},
		h6: {
			fontSize: "20px",
			fontWeight: 400,
			lineHeight: 0.3,
			letterSpacing: 0.05,
		},
	},
});

export default AppTheme;
