import "./TasksListTab.scss";
import TextAvatar from "./TextAvatar";
import moment from 'moment';

function TaskComponent(props) {
    const task = props.task;

    return (
        <div className="flex-column">
            <div className="flex-row">
                <TextAvatar width="40" height="40" text={task.customer.name} />
                <div className="flex-column flex-1 justify-between">
                    <span className="semi-bold">{task.name}</span>
                    <span className="regular">{task.customer.name}</span>
                </div>
            </div>
            {props.children}
            <div className="flex-row justify-between bottom">
                <span className="regular">{task.closed ? "Задача закрыта" : task.repliesCount + " заявок"}</span>
                <span className="regular">{moment(task.createdAt).fromNow()}</span>
            </div>
        </div>
    );
}

export default TaskComponent;