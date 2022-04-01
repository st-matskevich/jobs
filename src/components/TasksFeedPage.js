import "./TasksFeedPage.scss";
import { useUserProfile, useTasksFeed, CreateTask, FEED_SCOPE } from "../api/backend";
import {
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
} from "react-router-dom";
import addIcon from "../svg/add-icon.svg";
import TaskCreateComponent from "./TaskCreateComponent";
import TaskPage from "./TaskPage";
import moment from 'moment';
import 'moment/locale/ru';
import TaskComponent from "./TaskComponent";

function TasksFeedPage() {
    const history = useHistory();
    moment.locale('ru')

    //TODO: handle errors
    const profile = useUserProfile();

    //TODO: handle errors
    const scope = profile.data?.customer ? FEED_SCOPE.CUSTOMER : FEED_SCOPE.NOT_ASSIGNED;
    const feed = useTasksFeed(scope);

    function OnCreateTask(input) {
        if (!input.name)
            return;

        if (input.name.length > 128)
            return;

        if(!input.tags)
            return;

        if(input.tags.length < 1)
            return;

        if(input.tags.length > 5)
            return;

        if (!input.description)
            return;

        if (input.description.length > 2048)
            return;

        CreateTask({
            name: input.name,
            description: input.description,
            tags: input.tags
        }).then(function () {
            history.push("/tasks");
        }).catch(function (error) {
            //TODO: handle errors
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

    function RenderTaskPage() {
        if (profile.loading || profile.data?.name)
            return (<TaskPage />)
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
                {RenderTaskPage()}
            </Route>
        </Switch>
    );
}

export default TasksFeedPage;