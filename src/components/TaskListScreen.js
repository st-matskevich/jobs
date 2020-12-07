import "./TaskListScreen.scss";
import firebase from "firebase";
import { useState, useEffect } from 'react';
import {
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
} from "react-router-dom";
import { useSelector } from "react-redux";
import addIcon from "../svg/add-icon.svg";
import TextAvatar from "./TextAvatar";
import TaskScreen from "./TaskScreen";
import moment from 'moment';
import 'moment/locale/ru';

function TaskListScreen() {
    const profile = useSelector(state => state.profile);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [tasks, setTasks] = useState([]);
    const history = useHistory();
    moment.locale('ru')

    useEffect(() => {
        if (!profile)
            return;

        var query = firebase.firestore().collection("tasks");

        if (profile.customer)
            query = query.where("customer", "==", profile.reference);

        query.orderBy("created_at", "desc").get()
            .then(function (querySnapshot) {
                var queryTasks = [[], [], []]
                querySnapshot.forEach(function (doc) {
                    if (!profile.customer && doc.data().doer)
                        return;

                    queryTasks[0].push({
                        name: doc.data().name,
                        description: doc.data().description,
                        doer: doc.data().doer,
                        created_at: doc.data().created_at.toDate(),
                        id: doc.id,
                        reference: doc.ref
                    })
                    queryTasks[1].push(firebase.firestore().doc(doc.data().customer.path).get());
                    queryTasks[2].push(firebase.firestore().collection("replies").where("task", "==", doc.ref).get());
                })
                queryTasks[1] = Promise.all(queryTasks[1]);
                queryTasks[2] = Promise.all(queryTasks[2]);
                return Promise.all(queryTasks);
            })
            .then(function (res) {
                var resultTasks = res.shift();
                setTasks(resultTasks.map((val, index) =>
                    ({
                        ...val,
                        customer: res[0][index].data().name,
                        repliesCount: res[1][index].size
                    })
                ));
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }, [profile]);

    function CreateTask() {
        if (!newTaskName)
            return;

        if (!newTaskDescription)
            return;

        firebase.firestore().collection("tasks").add({
            name: newTaskName,
            description: newTaskDescription,
            customer: profile.reference,
            created_at: firebase.firestore.Timestamp.fromDate(new Date())
        }).then(function () {
            console.log("Task created!");
            history.push("/tasks");
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }

    return (
        <Switch>
            <Route exact path="/tasks">
                {profile && profile.customer ?
                    <Link to="/tasks/add" className="add-task">
                        <img src={addIcon} alt="list" />
                    </Link> : null}
                <div className="overflow-auto">
                    {profile ? tasks.map((task, index) => (
                        <Link className="card task-card" key={index} to={"/tasks/" + task.id}>
                            <div className="flex-row">
                                <TextAvatar width="40" height="40" text={task.customer} />
                                <div className="flex-column flex-1 justify-between">
                                    <span className="semi-bold">{task.name}</span>
                                    <span className="regular">{task.customer}</span>
                                </div>
                            </div>
                            <div className="flex-row justify-between bottom">
                                <span className="regular">{task.doer ? "Задача закрыта" : task.repliesCount + " заявок"}</span>
                                <span className="regular">{moment(task.created_at).fromNow()}</span>
                            </div>
                        </Link>
                    )) : null}
                </div>
            </Route>
            <Route path="/tasks/add">
                {profile && profile.customer ?
                    <div className="card flex-1 flex-column text-start add-task-wrapper">
                        <span className="semi-bold background">Создание нового заказа</span>
                        <input className="form-input" type="text" placeholder="Придумайте название заказа..."
                            value={newTaskName} onChange={(event) => {
                                setNewTaskName(event.target.value)
                            }} />
                        <textarea className="flex-1 form-input" placeholder="Опишите Ваш заказ..."
                            value={newTaskDescription} onChange={(event) => {
                                setNewTaskDescription(event.target.value)
                            }} />
                        <button className="button" onClick={CreateTask}>Создать заказ</button>
                    </div>
                    : <Redirect to="/tasks" />}
            </Route>
            {profile ? <Route path="/tasks/:id" children={<TaskScreen />}></Route> : <Redirect to="/tasks" />}
        </Switch>
    );
}

export default TaskListScreen;