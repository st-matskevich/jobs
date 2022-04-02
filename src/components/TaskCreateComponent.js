import "./TasksFeedPage.scss";
import { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { SearchTags } from "../api/backend";

const promiseOptions = (inputValue) =>
    new Promise((resolve, reject) => {
        SearchTags(inputValue).then(response => {
            resolve(response.data)
        }).catch(error => {
            //handle error?
            reject(error)
        })
    })

function TaskCreateComponent(props) {
    const onCreate = props.onCreate;
    const [input, setInput] = useState({
        name: "",
        description: "",
        tags: []
    });

    const [selectInput, setSelectInput] = useState("");

    return (
        <div className="card flex-1 flex-column text-start add-task-wrapper">
            <span className="semi-bold page-title background">Создание нового заказа</span>
            <input className="form-input" type="text" placeholder="Придумайте название заказа..."
                value={input.name}
                onChange={(event) => { setInput(i => ({ ...i, name: event.target.value })) }}
            />
            <AsyncCreatableSelect
                isMulti
                className="tag-select_parent"
                classNamePrefix="tag-select"
                placeholder="Выберите теги..."
                cacheOptions
                noOptionsMessage={() => "Введите что-нибудь для поиска"}
                loadingMessage={() => "Загрузка..."}
                loadOptions={promiseOptions}
                onChange={(value) => { setInput(i => ({ ...i, tags: value })) }}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
                formatCreateLabel={inputValue => "Создать тег \"" + inputValue + "\""}
                getNewOptionData={(inputValue, optionLabel) => ({ id: "MA==", name: optionLabel })}
                inputValue={selectInput}
                onInputChange={inputValue => setSelectInput(inputValue.substring(0, 32).toLocaleLowerCase())}
            />
            <textarea className="flex-1 form-input" placeholder="Опишите Ваш заказ..."
                value={input.description}
                onChange={(event) => { setInput(i => ({ ...i, description: event.target.value })) }}
            />
            <button className="button" onClick={() => { onCreate(input) }}>Создать заказ</button>
        </div>
    )
}

export default TaskCreateComponent;