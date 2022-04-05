import "./ProfileEditComponent.scss"
import { useEffect, useState } from 'react';
import TextAvatar from "./TextAvatar";

function ProfileEditComponent(props) {
    const [input, setInput] = useState({
        name: "",
        customer: false
    });

    const profile = props.profile;
    useEffect(() => {
        setInput({
            name: profile?.name ? profile.name : "",
            customer: profile?.customer ? profile.customer : false
        })
    }, [profile])

    return (
        <div className="card">
            <div className="flex-row" id="username_wrapper">
                <TextAvatar width="40" height="40" text={input.name} />
                <input className="underline-input" id="username_input" type="text" placeholder="ваше имя"
                    value={input.name} onChange={(event) => {
                        setInput(i => {
                            return {
                                ...i,
                                name: event.target.value
                            }
                        })
                    }} />
            </div>
            <label className="toggle-button" id="role_toggle">
                <input type="checkbox" checked={input.customer} onChange={(event) => {
                    setInput(i => {
                        return {
                            ...i,
                            customer: event.target.checked
                        }
                    })
                }} />
                <div className="first">Я исполнитель</div>
                <div>Я заказчик</div>
                <div className="selector"></div>
            </label>
            <button className="button" onClick={() => { props.onSubmit(input) }}>Сохранить</button>
        </div>
    );
}

export default ProfileEditComponent;