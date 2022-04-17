import { SetUserProfile } from "../api/backend";
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import ProfileEditPage from "./ProfileEditPage";
import ProfilePage from "./ProfilePage";
import { useSelector, useDispatch } from "react-redux"
import { requestProfile } from "../actions/actions"
import { logAnalyticsEvent, ANALYTICS_EVENTS } from "../api/firebase"

function ProfileRouter() {
    const history = useHistory();
    //TODO: handle error
    const profile = useSelector(state => state.profile);
    const dispatch = useDispatch()

    function SaveProfileData(input) {
        if (!input.name)
            return;

        if (input.name.length > 32)
            return;

        SetUserProfile(input).then(function () {
            logAnalyticsEvent(ANALYTICS_EVENTS.UPDATE_PROFILE, input);
            dispatch(requestProfile());
            history.push("/profile");
        }).catch(function (error) {
            //TODO: handle errors
            console.log(error);
        });
    }

    return (
        <Switch>
            <Route exact path="/profile">
                <ProfilePage profile={profile.data}/>
            </Route>
            <Route path="/profile/edit">
                <ProfileEditPage profile={profile.data} onSubmit={SaveProfileData}/>
            </Route>
        </Switch>
    );
}

export default ProfileRouter;