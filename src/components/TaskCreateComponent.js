import "./TasksTab.scss";
import { useState } from 'react';

function TaskCreateComponent(props) {
    const onCreate = props.onCreate;
    const [input, setInput] = useState({
        name: "",
        description: ""
    });

    return (
        <div className="card flex-1 flex-column text-start add-task-wrapper">
            <span className="semi-bold background">Создание нового заказа</span>
            <input className="form-input" type="text" placeholder="Придумайте название заказа..."
                value={input.name} onChange={(event) => {
                    setInput(i => {
                        return {
                            ...i,
                            name: event.target.value
                        }
                    })
                }} />
            <textarea className="flex-1 form-input" placeholder="Опишите Ваш заказ..."
                value={input.description} onChange={(event) => {
                    setInput(i => {
                        return {
                            ...i,
                            description: event.target.value
                        }
                    })
                }} />
            <button className="button" onClick={() => { onCreate(input) }}>Создать заказ</button>
        </div>
    )
}

export default TaskCreateComponent;