import "./NotificationsScreen.scss";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextAvatar from "./TextAvatar";
import moment from 'moment';

function NotificationsScreen() {
    const [notifications, setNotifications] = useState(null);
    const profile = useSelector(state => state.profile);

    useEffect(() => {
        if (profile.customer) {
            firebase.firestore().collection("tasks").where("customer", "==", profile.reference).orderBy("created_at", "desc").get()
                .then(function (querySnapshot) {
                    var result = [[], []];
                    querySnapshot.forEach((doc) => {
                        result[0].push({
                            name: doc.data().name,
                            id: doc.id,
                            reference: doc.ref
                        })
                        result[1].push(firebase.firestore().collection("replies").where("task", "==", doc.ref).orderBy("created_at", "desc").get());
                    })
                    result[1] = Promise.all(result[1]);
                    return Promise.all(result);
                }).then(function (res) {
                    res.push([]);
                    res[1] = res[1].reduce((acc, task, ind) => {
                        task.docs.forEach((entry) => {
                            acc.push({
                                task: res[0][ind],
                                description: entry.data().description,
                                created_at: entry.data().created_at.toDate(),
                                reference: entry.ref
                            });
                            res[2].push(firebase.firestore().doc(entry.data().client.path).get())
                        })
                        return acc;
                    }, []);
                    res[2] = Promise.all(res[2]);
                    res.shift();
                    return Promise.all(res);
                }).then(function (res) {
                    var replies = res[0].map((entry, ind) => ({
                        type: "NEW_REPLY",
                        data: {
                            ...entry,
                            doer: {
                                name: res[1][ind].data().name,
                                reference: res[1][ind].ref
                            }
                        }
                    }))

                    setNotifications(replies);
                }).catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        } else {
            firebase.firestore().collection("tasks").where("doer", "==", profile.reference).orderBy("created_at", "desc").get()
                .then(function (querySnapshot) {
                    var result = [[], []];

                    querySnapshot.forEach(entry => {
                        result[0].push({
                            name: entry.data().name,
                            created_at: entry.data().created_at.toDate(),
                            id: entry.id,
                            reference: entry.ref
                        })
                        result[1].push(firebase.firestore().doc(entry.data().customer.path).get());
                    })

                    result[1] = Promise.all(result[1]);
                    return Promise.all(result);
                }).then(function (res) {
                    var tasks = res[0].map((entry, ind) => ({
                        type: "APPROVE",
                        data: {
                            ...entry,
                            customer: {
                                name: res[1][ind].data().name,
                                reference: res[1][ind].ref
                            }
                        }
                    }))

                    setNotifications(tasks);
                }).catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        }
    }, []);

    const notificationsUI = (() => {
        if (!notifications)
            return null;

        return notifications.map((entry, index) => {
            if (entry.type == "NEW_REPLY") {
                return (
                    <div className="card notification-card" key={index}>
                        <span className="semi-bold background">Новая заявка</span>
                        <span className="regular background">{entry.data.task.name}</span>
                        <div className="flex-row reply-wrapper">
                            <TextAvatar width="40" height="40" text={entry.data.doer.name} />
                            <div className="flex-column flex-1 justify-between">
                                <span className="semi-bold background">{entry.data.doer.name}</span>
                                <div className="reply flex-column">
                                    <span className="background">{entry.data.description}</span>
                                    <span className="timestamp">{moment(entry.data.created_at).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>)
            } else if (entry.type == "APPROVE") {
                return (
                    <div className="card notification-card" key={index}>
                        <div className="flex-row reply-wrapper">
                            <TextAvatar width="40" height="40" text={entry.data.customer.name} />
                            <div className="flex-column flex-1 justify-between">
                                <span className="semi-bold background">{entry.data.name}</span>
                                <span className="background">{entry.data.customer.name}</span>
                            </div>
                        </div>
                        <span className="approve-text background">Заказчик выбрал Вас исполнителем!</span>
                        <span className="timestamp">{moment(entry.data.created_at).fromNow()}</span>
                    </div>)
            }
        });
    })();

    return (notificationsUI)
}

export default NotificationsScreen;