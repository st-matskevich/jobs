import { useUserProfile, SetUserProfile } from "../api/backend";
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
    const profile = useUserProfile();

    function SaveProfileData(input) {
        //TODO: handle errors
        if (!input.name)
            return;

        if (input.name.length > 32)
            return;

        SetUserProfile({
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
                <ProfileViewComponent profile={profile.data}/>
            </Route>
            <Route path="/profile/edit">
                <ProfileEditComponent profile={profile.data} onSubmit={SaveProfileData}/>
            </Route>
        </Switch>
    );
}

export default ProfileTab;