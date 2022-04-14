import "./TasksFeedPage.scss";
import TextAvatar from "./TextAvatar";

function AdCard() {
    return (<div className="card task-card">
        <div className="flex-row">
            <TextAvatar width="40" height="40" text="Adsterra" />
            <div className="flex-column flex-1 justify-between">
                <span className="semi-bold">Реклама</span>
                <span className="regular">Adsterra</span>
            </div>
        </div>
        <div id="container-7e6e0aefed391cb2e2a0e52e0c7624e2"></div>
    </div>)
}

export default AdCard;