import "./NotificationsTab.scss";
import "./TaskRoute.scss";
import { Link } from "react-router-dom";
import { useUserProfile, useNotifications, NOTIFICATIONS_TYPES } from "../api/backend"
import TextAvatar from "./TextAvatar";
import moment from 'moment';

function NotificationsTab() {

    const profile = useUserProfile();
    const notifications = useNotifications();

    function RenderNotificationsList() {
        if (profile.data?.name && notifications.data)
            return (
                <div className="overflow-auto">
                    {notifications.data.map((entry) => {
                        if (entry.type === NOTIFICATIONS_TYPES.NEW_REPLY) {
                            return (
                                <Link className="card task-card" to={"/tasks/" + entry.content.task.id} key={entry.id}>
                                    <span className="semi-bold background">{entry.content.task.name}</span>
                                    <span className="regular background new-reply">Новая заявка</span>
                                    <div className="flex-row reply-wrapper">
                                        <TextAvatar width="40" height="40" text={entry.content.reply.creator.name} />
                                        <div className="flex-column flex-1 justify-between">
                                            <span className="semi-bold background">{entry.content.reply.creator.name}</span>
                                            <div className="reply flex-column">
                                                <span className="background">{entry.content.reply.text}</span>
                                                <span className="timestamp">{moment(entry.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>)
                        } else if (entry.type === NOTIFICATIONS_TYPES.TASK_CLOSE) {
                            return (
                                <Link className="card task-card" to={"/tasks/" + entry.content.id} key={entry.id}>
                                    <div className="flex-column">
                                        <div className="flex-row">
                                            <TextAvatar width="40" height="40" text={entry.content.customer.name} />
                                            <div className="flex-column flex-1 justify-between">
                                                <span className="semi-bold background">{entry.content.name}</span>
                                                <span className="background">{entry.content.customer.name}</span>
                                            </div>
                                        </div>
                                        <span className="approve-text background">Заказчик выбрал Вас исполнителем!</span>
                                        <div className="flex-row justify-between bottom">
                                            <div></div>
                                            <span className="regular">{moment(entry.createdAt).fromNow()}</span>
                                        </div>
                                    </div>
                                </Link>)
                        }

                        return null
                    })}
                </div>
            )

        return null
    }

    return RenderNotificationsList();
}

export default NotificationsTab;