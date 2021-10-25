import "./TaskRoute.scss";
import { useParams, useHistory } from "react-router-dom";
import TaskComponent from "./TaskComponent";
import ReplyComponent from "./ReplyComponent";
import ReplyCreateComponent from "./ReplyCreateComponent";
import { useTask, useReplies, CreateReply } from "../api/backend"

function TaskRoute() {

    const { id } = useParams();
    const history = useHistory();

    //TODO: handle errors
    const task = useTask(id);
    const replies = useReplies(id);

    function OnCreateReply(input) {
        if (!input.text)
            return;

        if (!task.data?.id)
            return;

        CreateReply(task.data.id, input).then(function () {
            history.push("/tasks/" + id);
        }).catch(function (error) {
            console.log(error);
        });
    }

    function HideReply(entry) {
        /*entry.reference.update({
            hidden: true
        }).then(function () {
            entry.hidden = true;
            setTask({ ...task });
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });*/
    }

    function ApproveReply(entry) {
        /*task.reference.update({
            doer: entry.client.reference
        }).then(function () {
            history.push("/tasks");
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });*/
    }

    function RenderRepliesList() {
        if (task.data && replies.data)
            return (replies.data.all.map((reply) => (
                <ReplyComponent key={reply.id} reply={reply} drawCustomerControls={task.data.owns} onApprove={ApproveReply} onHide={HideReply}/>
            )));

        return null
    }

    function RenderCreateReplyComponent() {
        if (task.data && replies.data && !task.data.owns && !replies.data.user)
            return (<ReplyCreateComponent onCreate={OnCreateReply}/>)
        return null
    }

    return task.data ? (
        <div className="overflow-auto">
            <div className="card task-card">
                <TaskComponent task={task.data}>
                    <span className="task-description">{task.data.description}</span>
                </TaskComponent>
                <hr />
                {RenderRepliesList()}
                {RenderCreateReplyComponent()}
            </div>
        </div>
    ) : null
}

export default TaskRoute;