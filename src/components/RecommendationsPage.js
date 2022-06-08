import "./RecommendationsPage.scss";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import TaskComponent from "./TaskComponent";

const debugTask = {
    id: "Mjg0MDgzMjAyNTU3NTgxODQyMA==",
    name: "Разработка бота в Telegram для работы с площадкой Wildberries",
    description: "Нужно создать бота в ТГ для работы с площадкой Wildberries, Ozon. Подобности и ТЗ раскрою в личной переписке. Для удобства оставляйте свой ТГ линк. ТОЛЬКО С ОПЫТОМ И ПОНИМАНИЕМ В РАЗРАБОТКЕ БОТОВ В ТЕЛЕГРАМЕ. Обязательно наличие выполненных кейсов.",
    customer: { "id": "MjgxMjc0OTc5ODE0NTI2MjYwOQ==", "name": "Андрей" },
    closed: false,
    owns: true,
    liked: false,
    replies: 0,
    tags: [
        { id: "MjgxMjc1MzI5Mzg1NDM3NzAyMw==", text: "python" },
        { id: "MjgxMjc2NzA4MDA3ODY0MDUzNQ==", text: "bot" },
        { id: "MjgxMjc2ODU2MjI3ODU2NTM0NA==", text: "telegram" }
    ],
    createdAt: "2022-05-18T11:33:09.222825Z"
}

function RecommendationsPage() {
    // To move the card as the user drags the cursor
    const x = useMotionValue(0);

    // To rotate the card as the card moves on drag
    const rotate = useTransform(x, [-200, 200], [-50, 50]);

    // To decrease opacity of the card when swiped
    // on dragging card to left(-200) or right(200)
    // opacity gradually changes to 0
    // and when the card is in center opacity = 1
    const opacity = useTransform(
        x,
        [-200, -150, 0, 150, 200],
        [0, 1, 1, 1, 0]
    );

    // Framer animation hook
    const animControls = useAnimation();

    return (
        <div className="flex-1 recommendations-wrapper">
            <motion.div
                // Card can be drag only on x-axis
                drag="x"
                className="card task-card"
                dragConstraints={{ left: -1000, right: 1000 }}
                style={{ x, opacity, rotate }}
                animate={animControls}
                onDragEnd={(event, info) => {
                    // If the card is dragged only upto 150 on x-axis
                    // bring it back to initial position
                    if (Math.abs(info.offset.x) <= 150) {
                        animControls.start({ x: 0 });
                    } else {
                        // If card is dragged beyond 150
                        // make it disappear
                        // making use of ternary operator
                        animControls.start({ x: info.offset.x < 0 ? -200 : 200 });
                    }
                }}
            >
                <TaskComponent task={debugTask}>
                    <span className="task-description">{debugTask.description}</span>
                </TaskComponent>
            </motion.div>
        </div>
    );
};

export default RecommendationsPage;