import React from "react";
import { Box, useTheme, Typography } from "@mui/material";

import hero1 from "../assets/heroes/aksenov.png";
import hero2 from "../assets/heroes/ivanchenko.png";
import hero3 from "../assets/heroes/nazarov.png";
import hero4 from "../assets/heroes/filonenko.png";

import redLine from "../assets/RedLine.png";

const HeroDesk = () => {
	const theme = useTheme();

	const hero1Text = ["Аксенов", "Александр", "Александрович"];
	const hero2Text = ["Иваченко", "Николай", "Николаевич"];
	const hero3Text = ["Назаров", "Сергей", "Сергеевич"];
	const hero4Text = ["Филиненко", "Андрей", "Михайлович"];

	const hero1Desc =
		"Заместитель командира 18-й бригады армейской авиации по военно-политической работе 11-й армии военно-воздушных сил и противовоздушной обороны воздушно-космических сил, подполковник, военный летчик";
	const hero2Desc =
		"Учитель истории и обществознания, руководитель центра подготовки к ЕГЭ и ОГЭ  «Логос», доброволец, регулярно осуществляющий обучение тактической медицине, в том числе в зоне СВО";
	const hero3Desc =
		"С октября 2022 года принимал участие в СВО, назначен командиром штурмовой роты, успешно выполнил множество задач, связанных с риском для жизни";
	const hero4Desc =
		"Майор Андрей Филоненко участвует в специальной военной операции с февраля 2022 года. В том же году офицер Росгвардии отмечен медалью «За отвагу», а в 2023 и 2024 годах — награжден орденами Мужества";

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "end",
				justifyContent: "start",
				height: "100%",
				width: "100%",
			}}
		>
			<HeroCard hero={hero1} text={hero1Text} desc={hero1Desc} />
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
			<HeroCard hero={hero2} text={hero2Text} desc={hero2Desc} />
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
			<HeroCard hero={hero3} text={hero3Text} desc={hero3Desc} />
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
			<HeroCard hero={hero4} text={hero4Text} desc={hero4Desc} />
		</Box>
	);
};

const HeroCard = ({ hero, text, desc }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "end",
				position: "relative",
				minWidth: "350px",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "end",
					justifyContent: "space-between",
					gap: "10px",
					marginBottom: "-20px",
				}}
			>
				<Typography
					sx={{
						fontSize: "20px",
						fontWeight: "bold",
						color: "common.black",
						position: "relative",
						bottom: "60px",
						zIndex: 1,
					}}
				>
					{text[0]}
					<br />
					{text[1]}
					<br />
					{text[2]}
				</Typography>
				<Box
					component="img"
					src={hero}
					alt="hero"
					sx={{
						width: "50%",
						height: "100%",
						zIndex: 1,
						position: "relative",
					}}
				/>
			</Box>
			<Box
				sx={{
					marginRight: "-2%",
					marginBottom: "30px",
					width: "102%",
					height: "100%",
					backgroundColor: "secondary.light",
					position: "relative",
					borderRadius: "30px",
					paddingY: "20px",
					zIndex: 0,
				}}
			>
				<Typography
					sx={{
						fontSize: "20px",
						fontWeight: "bold",
						color: "common.black",
						position: "relative",
						fontWeight: "400",
						zIndex: 1,
						paddingX: "10px",
					}}
				>
					{desc}
				</Typography>
			</Box>
		</Box>
	);
};

export default HeroDesk;
