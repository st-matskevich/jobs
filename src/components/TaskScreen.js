import "./TaskScreen.scss";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import firebase from "firebase";
import TextAvatar from "./TextAvatar";
import moment from 'moment';
import { useSelector } from "react-redux";
import approveIcon from "../svg/approve-icon.svg"
import hideIcon from "../svg/hide-icon.svg"

function TaskScreen() {

    const { id } = useParams();
    const history = useHistory();
    const [task, setTask] = useState(null);
    const profile = useSelector(state => state.profile);
    const [reply, setReply] = useState("");

    useEffect(() => {
        firebase.firestore().collection("tasks").doc(id).get()
            .then(function (doc) {
                return Promise.all([{
                    name: doc.data().name,
                    description: doc.data().description,
                    doer: doc.data().doer,
                    created_at: doc.data().created_at.toDate(),
                    id: doc.id,
                    reference: doc.ref
                },
                firebase.firestore().doc(doc.data().customer.path).get(),
                firebase.firestore().collection("replies").where("task", "==", doc.ref).orderBy("created_at", "desc").get()])
            }).then(function (res) {
                res.push(Promise.all(res[2].docs.map((entry) => firebase.firestore().doc(entry.data().client.path).get())))
                return Promise.all(res);
            }).then(function (res) {

                var replies = res[2].docs.map((entry, index) =>
                    ({
                        description: entry.data().description,
                        client: {
                            name: res[3][index].data().name,
                            reference: res[3][index].ref
                        },
                        hidden: entry.data().hidden,
                        created_at: entry.data().created_at.toDate(),
                        reference: entry.ref
                    }))

                setTask({
                    ...res[0],
                    customer: res[1].data().name,
                    replies: replies,
                })

            }).catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }, []);

    function CreateReply() {
        if (!reply)
            return;

        var replyID = firebase.auth().currentUser.uid + "_" + id;
        firebase.firestore().collection("replies").doc(replyID).set({
            description: reply,
            created_at: firebase.firestore.Timestamp.fromDate(new Date()),
            client: profile.reference,
            hidden: false,
            task: task.reference
        }).then(function () {
            console.log("Reply created!");
            history.push("/tasks/" + id);
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }

    function HideReply(entry) {
        entry.reference.update({
            hidden: true
        }).then(function () {
            entry.hidden = true;
            setTask({ ...task });
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }

    function ApproveReply(entry) {
        task.reference.update({
            doer: entry.client.reference
        }).then(function () {
            history.push("/tasks");
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }

    const repliesList = (() => {
        if (!task)
            return null;

        if (task.doer)
            task.replies = task.replies.filter((entry) => entry.client.reference.path === task.doer.path)
        else {
            if (!profile.customer) {
                task.replies = task.replies.filter((entry) => entry.client.reference.path === profile.reference.path)
                if (!task.replies.length)
                    return (<div className="flex-column">
                        <textarea className="form-input" placeholder="Опишите Вашу заявку..."
                            value={reply} onChange={(event) => {
                                setReply(event.target.value)
                            }} />
                        <button className="button" onClick={CreateReply}>Оставить заявку</button>
                    </div>)
            }
            else task.replies = task.replies.filter((entry) => !entry.hidden)
        }

        return (task.replies.map((entry, index) => (
            <div className="flex-row reply-wrapper" key={index}>
                <TextAvatar width="40" height="40" text={entry.client.name} />
                <div className="flex-column flex-1 justify-between">
                    <span className="semi-bold">{entry.client.name}</span>
                    <div className="reply flex-column">
                        <span>{entry.description}</span>
                        <span className="timestamp">{moment(entry.created_at).fromNow()}</span>
                    </div>
                    {profile.customer && !task.doer ?
                        <div className="flex-row">
                            <button className="button" id="approve" onClick={() => { ApproveReply(entry) }}>
                                <img src={approveIcon} alt="approve" />
                            </button>
                            <button className="button" id="hide" onClick={() => { HideReply(entry) }}>
                                <img src={hideIcon} alt="hide" />
                            </button>
                        </div>
                        : null}
                </div>
            </div>
        )));
    })();

    return task ? (
        <div className="overflow-auto">
            <div className="card task-card">
                <div className="flex-row">
                    <TextAvatar width="40" height="40" text={task.customer} />
                    <div className="flex-column flex-1 justify-between">
                        <span className="semi-bold">{task.name}</span>
                        <span className="regular">{task.customer}</span>
                    </div>
                </div>
                <span className="task-description">{task.description}</span>
                <div className="flex-row justify-between bottom">
                    <span className="regular">{task.doer ? "Задача закрыта" : task.replies.length + " заявок"}</span>
                    <span className="regular">{moment(task.created_at).fromNow()}</span>
                </div>
                <hr />
                {repliesList}
            </div>
        </div>
    ) : null
}

export default TaskScreen;