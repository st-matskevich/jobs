import "./TasksTab.scss";
import { useUserProfile, useTasksFeed, CreateTask } from "../api/backend";
import {
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
} from "react-router-dom";
import addIcon from "../svg/add-icon.svg";
import TaskCreateComponent from "./TaskCreateComponent";
import TaskRoute from "./TaskRoute";
import moment from 'moment';
import 'moment/locale/ru';
import TaskComponent from "./TaskComponent";

function TasksTab() {
    const history = useHistory();
    moment.locale('ru')

    //TODO: handle errors
    const profile = useUserProfile();
    const feed = useTasksFeed();

    function OnCreateTask(input) {
        //TODO: handle errors
        if (!input.name)
            return;

        if (input.name.length > 64)
            return;

        if (!input.description)
            return;

        if (input.description.length > 512)
            return;

        CreateTask({
            name: input.name,
            description: input.description,
        }).then(function () {
            history.push("/tasks");
        }).catch(function (error) {
            console.log(error);
        });
    }

    function RenderTaskCreateComponent() {
        if (profile.data?.customer)
            return (<TaskCreateComponent onCreate={OnCreateTask} />)

        return null
    }

    function RenderTaskCreateButton() {
        if (profile.data?.customer)
            return (
                <Link to="/tasks/add" className="add-task">
                    <img src={addIcon} alt="list" />
                </Link>
            )

        return null
    }

    function RenderTaskList() {
        if (profile.data?.name && feed.data)
            return (
                <div className="overflow-auto">
                    {feed.data.map((task) => (
                        <Link className="card task-card" key={task.id} to={"/tasks/" + task.id}>
                            <TaskComponent task={task} />
                        </Link>
                    ))}
                </div>
            )

        return null
    }

    function RenderTaskRoute() {
        if (profile.loading || profile.data?.name)
            return (<TaskRoute />)
        else return <Redirect to="/tasks" />
    }

    return (
        <Switch>
            <Route exact path="/tasks">
                {RenderTaskCreateButton()}
                {RenderTaskList()}
            </Route>
            <Route path="/tasks/add">
                {RenderTaskCreateComponent()}
            </Route>
            <Route path="/tasks/:id">
                {RenderTaskRoute()}
            </Route>
        </Switch>
    );
}

export default TasksTab;