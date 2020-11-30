import "./TaskScreen.scss";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import firebase from "firebase";
import TextAvatar from "./TextAvatar";
import moment from 'moment';
import { useSelector } from "react-redux";

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
            task: task.reference
        }).then(function () {
            console.log("Reply created!");
            history.push("/tasks/" + id);
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }

    var repliesList = (() => {
        if (!task)
            return null;

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
        return (task.replies.map((reply, index) => (
            <div className="flex-row reply-wrapper" key={index}>
                <TextAvatar width="40" height="40" text={reply.client.name} />
                <div className="flex-column flex-1 justify-between">
                    <span className="semi-bold">{reply.client.name}</span>
                    <div className="reply flex-column">
                        <span>{reply.description}</span>
                        <span className="timestamp">{moment(reply.created_at).fromNow()}</span>
                    </div>
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
                    <span className="regular">{task.replies.length} заявок</span>
                    <span className="regular">{moment(task.created_at).fromNow()}</span>
                </div>
                <hr />
                {repliesList}
            </div>
        </div>
    ) : null
}

export default TaskScreen;