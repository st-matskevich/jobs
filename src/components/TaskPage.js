import "./TaskPage.scss";
import { useParams, useHistory } from "react-router-dom";
import TaskComponent from "./TaskComponent";
import ReplyComponent from "./ReplyComponent";
import ReplyCreateComponent from "./ReplyCreateComponent";
import { useTask, useReplies, CreateReply, CloseTask, HideReply } from "../api/backend"

function TaskPage() {

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

        CreateReply(id, input).then(function () {
            history.push("/tasks/" + id);
        }).catch(function (error) {
            //TODO: handle errors
            console.log(error);
        });
    }

    function OnHideReply(reply) {
        HideReply(id, reply.id).then(function () {
            history.push("/tasks/" + id);
        }).catch(function (error) {
            //TODO: handle errors
            console.log(error);
        });
    }

    function OnApproveReply(reply) {
        CloseTask(id, reply.creator.id).then(function () {
            history.push("/tasks/" + id);
        }).catch(function (error) {
            //TODO: handle errors
            console.log(error);
        });
    }

    function RenderRepliesList() {
        if (task.data && replies.data) {
            if (task.data.owns && replies.data.doer)
                return (<ReplyComponent reply={replies.data.doer} />)

            if (replies.data.user)
                return (<ReplyComponent reply={replies.data.user} />)

            if (replies.data.all)
                return (replies.data.all.map((reply) => (
                    <ReplyComponent key={reply.id} reply={reply} drawCustomerControls={task.data.owns} onApprove={OnApproveReply} onHide={OnHideReply} />
                )));
        }

        return null
    }

    function RenderCreateReplyComponent() {
        if (task.data && replies.data && !task.data.owns && !replies.data.user)
            return (<ReplyCreateComponent onCreate={OnCreateReply} />)
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

export default TaskPage;