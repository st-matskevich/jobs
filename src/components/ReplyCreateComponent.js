import "./TaskPage.scss";
import { useState } from 'react';

function ReplyCreateComponent(props) {
    const onCreate = props.onCreate;
    const [input, setInput] = useState({
        text: ""
    });

    return (
        <div className="flex-column">
            <textarea className="form-input" placeholder="Опишите Вашу заявку..."
                value={input.text} onChange={(event) => {
                    setInput(i => {
                        return {
                            ...i,
                            text: event.target.value
                        }
                    })
                }} />
            <button className="button" onClick={() => { onCreate(input) }}>Оставить заявку</button>
        </div>
    )
}

export default ReplyCreateComponent;