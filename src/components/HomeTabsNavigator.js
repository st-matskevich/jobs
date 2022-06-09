import "./HomeTabsNavigator.scss"
import listIcon from "../svg/list-icon.svg"
import listIconActive from "../svg/list-icon.active.svg"
import recommendationsIcon from "../svg/recommendations-icon.svg"
import recommendationsIconActive from "../svg/recommendations-icon.active.svg"
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
import ProfileRouter from "./ProfileRouter"
import TasksRouter from "./TasksRouter"
import RecommendationsPage from "./RecommendationsPage"
import NotificationsPage from "./NotificationsPage"
import { useEffect } from "react"
import { requestProfile } from "../actions/actions"
import { useDispatch } from "react-redux"
import 'moment/locale/ru';

function HomeTabsNavigator() {

    const dispatch = useDispatch()
    useEffect(() => dispatch(requestProfile()), [dispatch])

    const routes = [
        {
            path: "/tasks",
            content: () => <TasksRouter />
        },
        {
            path: "/recommendations",
            content: () => <RecommendationsPage />
        },
        {
            path: "/notifications",
            content: () => <NotificationsPage />
        },
        {
            path: "/profile",
            content: () => <ProfileRouter />
        }
    ];

    const match = {
        list: useRouteMatch("/tasks"),
        recommendations: useRouteMatch("/recommendations"),
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
                    <img src={match.list ? listIconActive : listIcon} className="icon" alt="tasks" />
                </Link>
                <Link className="tab" to="/recommendations">
                    <img src={match.recommendations ? recommendationsIconActive : recommendationsIcon} className="icon" alt="recommendations" />
                </Link>
                <Link className="tab" to="/notifications">
                    <img src={match.notifications ? notificationIconActive : notificationIcon} className="icon" alt="notifications" />
                </Link>
                <Link className="tab" to="/profile">
                    <img src={match.profile ? profileIconActive : profileIcon} className="icon" alt="profile" />
                </Link>
            </div>
        </div>
    )
}

export default HomeTabsNavigator;