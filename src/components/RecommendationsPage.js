import "./RecommendationsPage.scss";
import { useTasksFeed, FEED_SCOPE } from "../api/backend";
import { useSelector } from "react-redux"
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import TaskComponent from "./TaskComponent";
import EmptyProfileComponent from "./EmptyProfileComponent";
import likeIcon from "../svg/recommendation-like-icon.svg";
import hideIcon from "../svg/recommendation-hide-icon.svg";

function RecommendationCard(props) {
    const task = props.task;
    const animControls = useAnimation();
    const x = useMotionValue(0);

    const rotate = useTransform(x, [-200, 200], [-50, 50]);
    const opacity = useTransform(
        x,
        [-200, -150, 0, 150, 200],
        [0, 1, 1, 1, 0]
    );

    function SwipeCard(left) {
        animControls.start({ x: left ? -200 : 200, transitionEnd: { display: "none" } })
    }

    return (
        <motion.div
            drag="x"
            className="card task-card"
            dragConstraints={{ left: -1000, right: 1000 }}
            style={{ x, opacity, rotate }}
            animate={animControls}
            onDragEnd={(event, info) => {
                //info.offset sometimes returns incorrect numbers
                //so x.get() should be used until fixed
                if (Math.abs(x.get()) <= 150) {
                    animControls.start({ x: 0 });
                } else {
                    SwipeCard(x.get() < 0)
                }
            }}
        >
            <TaskComponent task={task} hideBottomBar>
                <span className="task-description">{task.description}</span>
                <div className="flex-row justify-evenly">
                    <div className="action-button" onClick={() => SwipeCard(true)}>
                        <img src={hideIcon} alt="hide" />
                    </div>
                    <div className="action-button" onClick={() => SwipeCard(false)}>
                        <img src={likeIcon} alt="like" />
                    </div>
                </div>
            </TaskComponent>
        </motion.div>
    );
}

function RecommendationsPage() {
    const profile = useSelector(state => state.profile);
    const tasks = useTasksFeed(FEED_SCOPE.RECOMMENDATIONS);

    function RenderRecommendationsList() {
        if (profile.data?.name && tasks.data)
            return (
                <div className="recommendations-wrapper">
                    {tasks.data.map((task) => (
                        <RecommendationCard key={task.id} task={task} />
                    ))}
                </div>
            )

        if (!profile.loading && !profile.data?.name)
            return (<EmptyProfileComponent key="empty" />)

        return null
    }

    return RenderRecommendationsList();
};

export default RecommendationsPage;