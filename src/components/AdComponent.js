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
        <div id="container-f9aee10839cd56f81b1f928e24fcd1d0"></div>
    </div>)
}

export default AdCard;