import "./MainRoute.scss"
import listIcon from "../svg/list-icon.svg"
import listIconActive from "../svg/list-icon.active.svg"
import notificationIcon from "../svg/notification-icon.svg"
import notificationIconActive from "../svg/notification-icon.active.svg"
import profileIcon from "../svg/profile-icon.svg"
import profileIconActive from "../svg/profile-icon.active.svg"
import {
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import ProfileScreen from "./ProfileScreen"
import TasksScreen from "./TasksScreen"

function MainRoute() {

    const routes = [
        {
            path: "/tasks",
            content: () => <TasksScreen/>
        },
        {
            path: "/notifications",
            content: () => <p>Notifications</p>
        },
        {
            path: "/profile",
            content: () => <ProfileScreen/>
        }
    ];

    const match = {
        list: useRouteMatch("/tasks"),
        notifications: useRouteMatch("/notifications"),
        profile: useRouteMatch("/profile")
    }

    return (
        <div className="main-wrapper">
            <div className="main-content-wrapper flex-column">
                <Switch>
                    {routes.map((route, index) =>
                        (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                children={<route.content />}
                            />
                        )
                    )}
                </Switch>
            </div>
            <div className="bottom-navigator-wrapper">
                <Link className="tab" to="/tasks">
                    <img src={match.list ? listIconActive : listIcon} className="icon" alt="list" />
                </Link>
                <Link className="tab" to="/notifications">
                    <img src={match.notifications ? notificationIconActive : notificationIcon} className="icon" alt="list" />
                </Link>
                <Link className="tab" to="/profile">
                    <img src={match.profile ? profileIconActive : profileIcon} className="icon" alt="list" />
                </Link>
            </div>
        </div>
    )
}

export default MainRoute;