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
        var query = firebase.firestore().collection("tasks");

        if (profile.customer)
            query = query.where("customer", "==", profile.reference);

        query/*.orderBy("created_at")*/.get()
            .then(function (querySnapshot) {
                var queryTasks = [[]]
                querySnapshot.forEach(function (doc) {
                    queryTasks[0].push({
                        name: doc.data().name,
                        description: doc.data().description,
                        created_at: doc.data().created_at.toDate(),
                        id: doc.id,
                        reference: doc.ref
                    })
                    queryTasks.push(firebase.firestore().doc(doc.data().customer.path).get());
                })
                return Promise.all(queryTasks);
            })
            .then(function (res) {
                var resultTasks = res.shift();
                setTasks(resultTasks.map((val, index) => { return { ...val, customer: res[index].data().name } }));
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }, []);

    function CreateTask() {
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
                                <span className="regular">0 заявок</span>
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
            <Route path="/tasks/:id" children={<TaskScreen />}>
            </Route>
        </Switch>
    );
}

export default TaskListScreen;