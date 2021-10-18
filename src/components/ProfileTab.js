import backend from "../api/backend";
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import ProfileEditComponent from "./ProfileEditComponent";
import ProfileViewComponent from "./ProfileViewComponent";

function ProfileTab() {
    const history = useHistory();
    //TODO: handle error
    const { profile, error } = backend.useUserProfile();

    function SaveProfileData(input) {
        if (!input.name)
            return;

        backend.SetUserProfile({
            name: input.name,
            customer: input.customer,
        }).then(function () {
            history.push("/profile");
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <Switch>
            <Route exact path="/profile">
                <ProfileViewComponent profile={profile}></ProfileViewComponent>
            </Route>
            <Route path="/profile/edit">
                <ProfileEditComponent profile={profile} onSubmit={SaveProfileData}></ProfileEditComponent>
            </Route>
        </Switch>
    );
}

export default ProfileTab;