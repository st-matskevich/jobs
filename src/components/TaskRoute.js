import "./TaskRoute.scss";
import { useParams, useHistory } from "react-router-dom";
import { useState } from 'react';
import TaskComponent from "./TaskComponent";
import ReplyComponent from "./ReplyComponent";

import { useTask, useReplies, CreateReply } from "../api/backend"

function TaskRoute() {

    const { id } = useParams();
    const history = useHistory();
    const [input, setInput] = useState({
        text: ""
    });

    const task = useTask(id);
    const replies = useReplies(id);

    function OnCreateReply() {
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

    function RenderRepliesListComponent() {
        if (task.data && replies.data)
            return (replies.data.all.map((reply) => (
                <ReplyComponent key={reply.id} reply={reply} drawCustomerControls={task.data.owns} onApprove={ApproveReply} onHide={HideReply}/>
            )));

        return null
    }

    function RenderCreateReplyComponent() {
        if (task.data && replies.data && !task.data.owns && !replies.data.user)
            return (
                <div className="flex-column">
                    <textarea className="form-input" placeholder="Опишите Вашу заявку..."
                        value={input.text} onChange={(event) => {
                            setInput(i => {
                                return {
                                    ...i,
                                    text: event.target.value
                                }
                            })
                        }} />
                    <button className="button" onClick={OnCreateReply}>Оставить заявку</button>
                </div>
            )

        return null
    }

    return task.data ? (
        <div className="overflow-auto">
            <div className="card task-card">
                <TaskComponent task={task.data}>
                    <span className="task-description">{task.data.description}</span>
                </TaskComponent>
                <hr />
                {RenderRepliesListComponent()}
                {RenderCreateReplyComponent()}
            </div>
        </div>
    ) : null
}

export default TaskRoute;