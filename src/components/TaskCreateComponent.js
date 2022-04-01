import "./TasksFeedPage.scss";
import { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { SearchTags } from "../api/backend";

const promiseOptions = (inputValue) =>
    new Promise((resolve, reject) => {
        SearchTags(inputValue).then((response) => {
            resolve(response.data.map(tag => { return { value: tag.id, label: tag.name } }))
        })
    })

function TaskCreateComponent(props) {
    const onCreate = props.onCreate;
    const [input, setInput] = useState({
        name: "",
        description: "",
        tags: []
    });

    return (
        <div className="card flex-1 flex-column text-start add-task-wrapper">
            <span className="semi-bold page-title background">Создание нового заказа</span>
            <input className="form-input" type="text" placeholder="Придумайте название заказа..."
                value={input.name} onChange={(event) => {
                    setInput(i => {
                        return {
                            ...i,
                            name: event.target.value
                        }
                    })
                }} />
            <AsyncCreatableSelect
                isMulti
                className="tag-select_parent"
                classNamePrefix="tag-select"
                placeholder="Выберите теги..."
                cacheOptions
                noOptionsMessage={() => "Введите что-нибудь для поиска"}
                loadOptions={promiseOptions}
                onChange={(value) => {
                    setInput(i => {
                        return {
                            ...i,
                            tags: value
                        }
                    })
                }}
            />
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