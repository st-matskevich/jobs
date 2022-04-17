import "./ProfilePage.scss";
import TextAvatar from "./TextAvatar";
import { Link } from "react-router-dom";
import editIcon from "../svg/edit-icon.svg";
import { GetAuth } from "../api/firebase";

function ProfilePage(props) {
    const profile = props.profile

    return (
        <div className="card">
            {
                profile ?
                    <div className="flex-row" id="user_profile">
                        <TextAvatar width="40" height="40" text={profile.name} />
                        <div className="flex-column flex-1 justify-between">
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
                GetAuth().signOut()
            }}>Выйти</button>
        </div>
    );
}

export default ProfilePage;