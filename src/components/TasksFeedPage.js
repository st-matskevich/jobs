import "./TasksFeedPage.scss";
import { useTasksFeed, FEED_SCOPE } from "../api/backend";
import { Link } from "react-router-dom";
import addIcon from "../svg/add-icon.svg";
import TaskComponent from "./TaskComponent";
import SearchHeaderComponent from "./SearchHeaderComponent";
import { useState } from "react";
import EmptyProfileComponent from "./EmptyProfileComponent";
import { logAnalyticsEvent, ANALYTICS_EVENTS } from "../api/firebase"
import { useSelector, useDispatch } from "react-redux"
import { setTasksScope } from "../actions/actions"

const filters = [
    { value: FEED_SCOPE.NOT_ASSIGNED, label: "Открытые задачи" },
    { value: FEED_SCOPE.CUSTOMER, label: "Я заказчик" },
    { value: FEED_SCOPE.DOER, label: "Я исполнитель" },
    { value: FEED_SCOPE.REPLIED, label: "Мои заявки" },
    { value: FEED_SCOPE.LIKED, label: "Мне нравится" },
    { value: FEED_SCOPE.RECOMMENDATIONS, label: "Рекомендации" }
]

function TasksFeedPage() {
    const profile = useSelector(state => state.profile);
    const dispatch = useDispatch();

    //TODO: handle errors
    const scope = useSelector(state => state.feedScope);
    const [search, setSearch] = useState("");
    const feed = useTasksFeed(scope, search);

    function RenderSearchHeader() {
        if (profile.data?.name)
            return (
                <SearchHeaderComponent
                    key="search"
                    filters={filters}
                    selectedFilter={scope}
                    onFilterChange={value => { logAnalyticsEvent(ANALYTICS_EVENTS.CHANGE_TASKS_FILTER, {filter: value}); dispatch(setTasksScope(value)) }}
                    onInputChange={event => setSearch(event.target.value)}
                />
            )

        return null
    }

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

        if (!profile.loading && !profile.data?.name)
            return (<EmptyProfileComponent key="empty" />)

        return null
    }

    return [
        RenderSearchHeader(),
        RenderTaskCreateButton(),
        RenderTaskList()
    ];
}

export default TasksFeedPage;