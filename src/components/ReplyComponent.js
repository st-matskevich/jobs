import "./TaskPage.scss";
import TextAvatar from "./TextAvatar";
import moment from 'moment';
import approveIcon from "../svg/approve-icon.svg"
import hideIcon from "../svg/hide-icon.svg"

function ReplyComponent(props) {
    const reply = props.reply;
    const customer = props.drawCustomerControls;
    const onApprove = props.onApprove;
    const onHide = props.onHide;

    return (
        <div className="flex-row reply-wrapper">
            <TextAvatar width="40" height="40" text={reply.creator.name} />
            <div className="flex-column flex-1 justify-between">
                <span className="semi-bold">{reply.creator.name}</span>
                <div className="reply flex-column">
                    <span className="reply-description">{reply.text}</span>
                    <span className="timestamp">{moment(reply.createdAt).fromNow()}</span>
                </div>
                {customer ?
                    <div className="flex-row">
                        <button className="button" id="approve" onClick={() => { onApprove(reply) }}>
                            <img src={approveIcon} alt="approve" />
                        </button>
                        <button className="button" id="hide" onClick={() => { onHide(reply) }}>
                            <img src={hideIcon} alt="hide" />
                        </button>
                    </div>
                    : null}
            </div>
        </div>
    )
}


export default ReplyComponent;