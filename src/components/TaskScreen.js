import "./TaskScreen.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import firebase from "firebase";
import TextAvatar from "./TextAvatar";
import moment from 'moment';

function TaskScreen() {

    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        firebase.firestore().collection("tasks").doc(id).get()
            .then(function (doc) {
                return Promise.all([{
                    name: doc.data().name,
                    description: doc.data().description,
                    created_at: doc.data().created_at.toDate(),
                    id: doc.id,
                    reference: doc.ref
                }, firebase.firestore().doc(doc.data().customer.path).get()])
            })
            .then(function (res) {
                setTask({ ...res[0], customer: res[1].data().name });
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }, []);

    return task ? (
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
                <span className="regular">0 заявок</span>
                <span className="regular">{moment(task.created_at).fromNow()}</span>
            </div>
            <hr />
        </div>
    ) : null
}

export default TaskScreen;