import React, { useState } from "react";
import { Box, Typography, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const OftenQuestions = () => {
	const questions = [
		{
			question: "Какие существуют программы реабилитации для ветеранов?",
			answer:
				"В рамках государственной поддержки ветеранов СВО доступны различные программы реабилитации, включая медицинскую, психологическую, социальную и профессиональную. Вы можете получить бесплатное санаторно-курортное лечение, специализированную медицинскую помощь, консультации психологов и тренинги по социальной адаптации. Многие реабилитационные центры предлагают комплексные программы восстановления для участников СВО и ветеранов боевых действий.",
		},
		{
			question: "Как найти работу после возвращения с войны?",
			answer:
				"Для трудоустройства ветеранов СВО существует ряд специальных программ. Вы можете обратиться в центры занятости, где предоставляются приоритетные вакансии для участников боевых действий. Кроме того, многие крупные компании имеют квоты для трудоустройства ветеранов. Доступны также программы переобучения и повышения квалификации, которые помогут освоить новую профессию. На нашем портале вы найдете список компаний-партнеров, готовых принять на работу ветеранов СВО.",
		},
		{
			question: "Как получить финансовую помощь для моей семьи?",
			answer:
				" Существует ряд государственных и частных программ, предлагающих финансовую поддержку семьям военнослужащих. Обратитесь в соответствующие органы или благотворительные организации для получения подробной информации.",
		},
		{
			question: "Где я могу получить помощь в адаптации к гражданской жизни?",
			answer:
				"Для адаптации к гражданской жизни существуют специализированные центры, группы поддержки и комьюнити ветеранов. Мы рекомендуем обратиться в ближайший центр психологической поддержки или воспользоваться нашими онлайн-консультациями. Также полезно участвовать в сообществах и форумах ветеранов, где вы можете поделиться опытом и получить советы от тех, кто уже прошел процесс адаптации.",
		},
	];

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
			{questions.map((question) => (
				<Question key={question.question} question={question} />
			))}
		</Box>
	);
};

const Question = ({ question }) => {
	const [expanded, setExpanded] = useState(false);

	const handleToggle = () => {
		setExpanded(!expanded);
	};

	return (
		<Box
			sx={{
				marginBottom: "20px",
				width: "100%",
				transition: "all 0.3s ease",
			}}
		>
			<Box
				sx={{
					width: "100%",
					backgroundColor: "secondary.main",
					position: "relative",
					borderRadius: expanded ? "30px 30px 0 0" : "30px",
					padding: "20px",
					userSelect: "none",
					display: "flex",
					justifyContent: "space-between",
					zIndex: 0,
					cursor: "pointer",
					transition: "all 0.3s ease",
					boxShadow: expanded ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
				}}
				onClick={handleToggle}
			>
				<Typography
					sx={{
						fontSize: 20,
						fontFamily: "TTTravels",
						fontWeight: expanded ? 500 : 400,
						width: "90%",
					}}
				>
					{question.question}
				</Typography>
				<IconButton
					onClick={(e) => {
						e.stopPropagation();
						handleToggle();
					}}
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "transform 0.3s",
					}}
				>
					<ExpandMoreIcon />
				</IconButton>
			</Box>

			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Box
					sx={{
						padding: "20px",
						backgroundColor: "rgba(255, 255, 255, 0.05)",
						borderRadius: "0 0 30px 30px",
						marginTop: "-1px",
						border: "1px solid",
						borderTop: "none",
						borderColor: "primary.main",
						width: "100%",
					}}
				>
					<Typography
						sx={{
							fontSize: 16,
							fontFamily: "TTTravels",
							fontWeight: 600,
							lineHeight: 1.5,
							color: "primary.main",
						}}
					>
						{question.answer}
					</Typography>
				</Box>
			</Collapse>
		</Box>
	);
};

export default OftenQuestions;
