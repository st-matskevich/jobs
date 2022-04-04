import { useSelector } from "react-redux"
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import TaskCreatePage from "./TaskCreatePage";
import TaskPage from "./TaskPage";
import TasksFeedPage from "./TasksFeedPage";

function TasksRouter() {
    const profile = useSelector(state => state.profile);

    return (
        <Switch>
            <Route exact path="/tasks">
                <TasksFeedPage />
            </Route>
            <Route path="/tasks/add">
                {profile.loading || profile.data?.customer ? <TaskCreatePage /> : <Redirect to="/tasks" />}
            </Route>
            <Route path="/tasks/:id">
                {profile.loading || profile.data?.name ? <TaskPage /> : <Redirect to="/tasks" />}
            </Route>
        </Switch>
    );
}
export default TasksRouter;