import "./TasksFeedPage.scss";
import { useTasksFeed, CreateTask, FEED_SCOPE } from "../api/backend";
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
import SearchHeaderComponent from "./SearchHeaderComponent";
import { useState } from "react";
import { useSelector } from "react-redux"

const filters = [
    { value: FEED_SCOPE.CUSTOMER, label: "Я заказчик" },
    { value: FEED_SCOPE.NOT_ASSIGNED, label: "Открытые задачи" },
    { value: FEED_SCOPE.DOER, label: "Я исполнитель" }
]

function TasksFeedPage() {
    const history = useHistory();
    moment.locale('ru')

    const profile = useSelector(state => state.profile);

    //TODO: handle errors
    const [scope, setScope] = useState(FEED_SCOPE.NOT_ASSIGNED);
    const [search, setSearch] = useState("");
    const feed = useTasksFeed(scope, search);

    function OnCreateTask(input) {
        if (!input.name)
            return;

        if (input.name.length > 128)
            return;

        if (!input.tags)
            return;

        if (input.tags.length < 1)
            return;

        if (input.tags.length > 5)
            return;

        if (!input.description)
            return;

        if (input.description.length > 2048)
            return;

        CreateTask({
            name: input.name,
            description: input.description,
            tags: input.tags.map(tag => ({ ...tag, id: tag.new ? "MA==" : tag.id }))
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
                <SearchHeaderComponent
                    filters={filters}
                    selectedFilter={scope}
                    onFilterChange={value => setScope(value)}
                    onInputChange={event => setSearch(event.target.value)}
                />
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