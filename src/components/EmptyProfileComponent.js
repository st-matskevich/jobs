import "./EmptyProfileComponent.scss"
import { Link } from "react-router-dom";
import workingImage from "../svg/working-image.svg";

function EmptyProfileComponent() {
    return(<div className="card task-card flex-column empty-profile-card">
        <img src={workingImage} alt="working"></img>
        <div className="message">Чтобы начать работу,<br></br> внесите информацию о себе</div>
        <Link className="button" to="/profile/edit">Перейти в профиль</Link>
    </div>)
}
export default EmptyProfileComponent;