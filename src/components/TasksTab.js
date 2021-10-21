import "./TasksTab.scss";
import backend from "../api/backend";
import {
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
} from "react-router-dom";
import addIcon from "../svg/add-icon.svg";
import TaskCreateComponent from "./TaskCreateComponent";
import TaskScreen from "./TaskScreen";
import moment from 'moment';
import 'moment/locale/ru';
import TaskListComponent from "./TasksListComponent";

function TasksTab() {
    const history = useHistory();
    moment.locale('ru')

    //TODO: handle errors
    const profile = backend.useUserProfile();
    const feed = backend.useTasksFeed();

    function CreateTask(input) {
        //TODO: handle errors
        if (!input.name)
            return;

        if (input.name.length > 64)
            return;

        if (!input.description)
            return;

        if (input.description.length > 512)
            return;

        backend.CreateTask({
            name: input.name,
            description: input.description,
        }).then(function () {
            history.push("/tasks");
        }).catch(function (error) {
            console.log(error);
        });
    }

    function RenderTaskCreateComponent() {
        if (!profile.loading && profile.data?.customer)
            return (<TaskCreateComponent onSubmit={CreateTask}></TaskCreateComponent>)

        return null
    }

    function RenderTaskCreateButton() {
        if (!profile.loading && profile.data?.customer)
            return (<Link to="/tasks/add" className="add-task">
                <img src={addIcon} alt="list" />
            </Link>)

        return null
    }

    function RenderTaskListComponent() {
        if (!profile.loading && profile.data?.name.length)
            return (<TaskListComponent feed={feed.data}></TaskListComponent>)

        return null
    }

    return (
        <Switch>
            <Route exact path="/tasks">
                {RenderTaskCreateButton()}
                {RenderTaskListComponent()}
            </Route>
            <Route path="/tasks/add">
                {RenderTaskCreateComponent()}
            </Route>
            {profile.data ? <Route path="/tasks/:id" children={<TaskScreen />}></Route> : <Redirect to="/tasks" />}
        </Switch>
    );
}

export default TasksTab;