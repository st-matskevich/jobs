import "./TasksFeedPage.scss";
import { useTasksFeed, FEED_SCOPE } from "../api/backend";
import { Link } from "react-router-dom";
import addIcon from "../svg/add-icon.svg";
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
    const profile = useSelector(state => state.profile);

    //TODO: handle errors
    const [scope, setScope] = useState(FEED_SCOPE.NOT_ASSIGNED);
    const [search, setSearch] = useState("");
    const feed = useTasksFeed(scope, search);

    function RenderTaskCreateButton() {
        if (profile.data?.customer)
            return (
                <Link to="/tasks/add" className="add-task" key="create">
                    <img src={addIcon} alt="list" />
                </Link>
            )

        return null
    }

    function RenderTaskList() {
        if (profile.data?.name && feed.data)
            return (
                <div className="overflow-auto" key="feed">
                    {feed.data.map((task) => (
                        <Link className="card task-card" key={task.id} to={"/tasks/" + task.id}>
                            <TaskComponent task={task} />
                        </Link>
                    ))}
                </div>
            )

        return null
    }

    return [
        (<SearchHeaderComponent
            key="search"
            filters={filters}
            selectedFilter={scope}
            onFilterChange={value => setScope(value)}
            onInputChange={event => setSearch(event.target.value)}
        />),
        RenderTaskCreateButton(),
        RenderTaskList()
    ];
}

export default TasksFeedPage;