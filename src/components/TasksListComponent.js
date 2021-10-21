import "./TasksTab.scss";
import { Link } from "react-router-dom";
import TextAvatar from "./TextAvatar";
import moment from 'moment';

function TaskListComponent(props) {
    const feed = props.feed;

    return (
        <div className="overflow-auto">
            {feed ? feed.map((task, index) => (
                <Link className="card task-card" key={index} to={"/tasks/" + task.id}>
                    <div className="flex-row">
                        <TextAvatar width="40" height="40" text={task.customer} />
                        <div className="flex-column flex-1 justify-between">
                            <span className="semi-bold">{task.name}</span>
                            <span className="regular">{task.customer}</span>
                        </div>
                    </div>
                    <div className="flex-row justify-between bottom">
                        <span className="regular">{/*task.doer ? "Задача закрыта" : task.repliesCount + " заявок"*/ "количество заявок"}</span>
                        <span className="regular">{moment(task.createdAt).fromNow()}</span>
                    </div>
                </Link>
            )) : null}
        </div>
    );
}

export default TaskListComponent;