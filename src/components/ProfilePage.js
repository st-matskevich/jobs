import { SetUserProfile } from "../api/backend";
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import ProfileEditComponent from "./ProfileEditComponent";
import ProfileViewComponent from "./ProfileViewComponent";
import { useSelector } from "react-redux"
import { requestProfile } from "../actions/actions"
import { useDispatch } from "react-redux"

function ProfilePage() {
    const history = useHistory();
    //TODO: handle error
    const profile = useSelector(state => state.profile);
    const dispatch = useDispatch()

    function SaveProfileData(input) {
        if (!input.name)
            return;

        if (input.name.length > 32)
            return;

        SetUserProfile({
            name: input.name,
            customer: input.customer,
        }).then(function () {
            dispatch(requestProfile())
            history.push("/profile");
        }).catch(function (error) {
            //TODO: handle errors
            console.log(error);
        });
    }

    return (
        <Switch>
            <Route exact path="/profile">
                <ProfileViewComponent profile={profile.data}/>
            </Route>
            <Route path="/profile/edit">
                <ProfileEditComponent profile={profile.data} onSubmit={SaveProfileData}/>
            </Route>
        </Switch>
    );
}

export default ProfilePage;