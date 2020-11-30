import "./ProfileScreen.scss";
import firebase from "firebase";
import { useState } from 'react';
import editIcon from "../svg/edit-icon.svg";
import {
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { useSelector } from "react-redux";
import TextAvatar from "./TextAvatar";

function ProfileScreen() {

    const user = firebase.auth().currentUser;
    const profile = useSelector( state => state.profile);
    const [name, setName] = useState(profile.name ? profile.name : "");
    const [customer, setCustomer] = useState(profile.customer ? profile.customer : false);
    const history = useHistory();

    function SaveProfileData() {
        if (!name)
            return;

        firebase.firestore().collection("users").doc(user.uid).set({
            name: name,
            customer: customer,
        }).then(function () {
            console.log("Profile updated!");
            history.push("/profile");
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }

    return (
        <Switch>
            <Route exact path="/profile">
                <div className="card">
                    {
                        profile ?
                            <div className="flex-row" id="user_profile">
                                <TextAvatar width="40" height="40" text={profile.name} />
                                <div className="flex-column flex-1 justify-evenly">
                                    <span className="semi-bold">{profile.name}</span>
                                    <span className="regular">{profile.customer ? "Заказчик" : "Исполнитель"}</span>
                                </div>
                            </div>
                            :
                            null
                    }
                    <Link className="button secondary" id="profile_edit" to="/profile/edit">
                        <img src={editIcon} alt="edit" />
                        Изменить данные
                    </Link>
                    <button className="button" onClick={() => {
                        firebase.auth().signOut()
                    }}>Выйти</button>
                </div>
            </Route>
            <Route path="/profile/edit">
                <div className="card">
                    <div className="flex-row" id="username_wrapper">
                        <TextAvatar width="40" height="40" text={name} />
                        <input className="underline-input" id="username_input" type="text" placeholder="ваше имя"
                            value={name} onChange={(event) => {
                                setName(event.target.value)
                            }} />
                    </div>
                    <label className="toggle-button" id="role_toggle">
                        <input type="checkbox" checked={customer} onChange={(event) => {
                            setCustomer(event.target.checked)
                        }} />
                        <div className="first">Я исполнитель</div>
                        <div>Я заказчик</div>
                        <div className="selector"></div>
                    </label>
                    <button className="button" onClick={SaveProfileData}>Сохранить</button>
                </div>
            </Route>
        </Switch>
    );
}

export default ProfileScreen;