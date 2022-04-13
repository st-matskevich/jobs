import "./TasksFeedPage.scss";
import TextAvatar from "./TextAvatar";
import moment from 'moment';
import likeIcon from "../svg/like-icon.svg";
import likeIconActive from "../svg/like-icon.active.svg";
import { useState } from "react";
import { LikeTask } from "../api/backend";
import { logAnalyticsEvent, ANALYTICS_EVENTS } from "../api/firebase"

function TaskComponent(props) {
    const task = props.task;
    const [taskLiked, setTaskLike] = useState(task.liked);

    function onTaskLike(event) {
        event.stopPropagation();
        event.preventDefault();
        LikeTask(task.id, !taskLiked).then(response => {
            logAnalyticsEvent(ANALYTICS_EVENTS.LIKE_TASK, task.id);
            setTaskLike(response.data);
        }).catch(error => {
            //TODO: handle errors
            console.log(error);
        });
    }

    function RenderTaskTags() {
        if (task.tags?.length > 0) {
            return (
                <div className="flex-row tags-container">
                    {task.tags.map((tag) => (
                        <span className="tag" key={tag.id} >{tag.text}</span>
                    ))}
                </div>
            )
        }
    }

    function GetStatsString() {
        const time = moment(task.createdAt).fromNow();
        const replies = task.closed ? "Задача закрыта" : task.replies + " заявок";
        return [time, replies].join(' · ');
    }

    return (
        <div className="flex-column">
            <div className="flex-row">
                <TextAvatar width="40" height="40" text={task.customer.name} />
                <div className="flex-column flex-1 justify-between">
                    <span className="semi-bold">{task.name}</span>
                    <span className="regular">{task.customer.name}</span>
                </div>
            </div>
            {RenderTaskTags()}
            {props.children}
            <div className="flex-row justify-between bottom">
                <span className="regular">{GetStatsString()}</span>
                <div onClick={onTaskLike}>
                    <img src={taskLiked ? likeIconActive : likeIcon} alt="like" />
                </div>
            </div>
        </div>
    );
}

export default TaskComponent;