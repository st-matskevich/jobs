import "./TasksScreen.scss"
import firebase from "firebase";
import {
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import addIcon from "../svg/add-icon.svg"

function TasksScreen() {
    const user = firebase.auth().currentUser;

    return (
        <Switch>
            <Route exact path="/tasks">
                {user.profile && user.profile.customer ?
                    <Link to="/tasks/add" className="add-task">
                        <img src={addIcon} alt="list" />
                    </Link> : null}
            </Route>
            <Route path="/tasks/add">
                {user.profile && user.profile.customer ?
                    <div className="card flex-1 flex-column text-start add-task-wrapper">
                        <span className="semi-bold background">Создание нового заказа</span>
                        <input type="text"/>
                        <textarea className="flex-1"/>
                        <button className="button">Создать заказ</button>
                    </div>
                    : <Redirect to="/tasks" />}
            </Route>
        </Switch>
    );
}

export default TasksScreen;