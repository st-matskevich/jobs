import "./TasksFeedPage.scss";
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useTags } from "../api/backend";

function TaskCreateComponent(props) {
    const onCreate = props.onCreate;
    const [input, setInput] = useState({
        name: "",
        description: "",
        tags: []
    });

    const [selectInput, setSelectInput] = useState("");
    const tags = useTags(selectInput);

    return (
        <div className="card flex-1 flex-column text-start add-task-wrapper">
            <span className="semi-bold page-title background">Создание нового заказа</span>
            <input className="form-input" type="text" placeholder="Придумайте название заказа..."
                value={input.name}
                onChange={(event) => { setInput(i => ({ ...i, name: event.target.value })) }}
            />
            <CreatableSelect
                isMulti
                className="tag-select_parent"
                classNamePrefix="tag-select"
                placeholder="Выберите теги..."
                options={tags.data ? tags.data : []}
                isLoading={tags.loading}
                allowCreateWhileLoading={false}
                noOptionsMessage={() => "Введите что-нибудь для поиска"}
                loadingMessage={() => "Загрузка..."}
                onChange={(value) => { setInput(i => ({ ...i, tags: value })) }}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
                formatCreateLabel={inputValue => "Создать тег \"" + inputValue + "\""}
                getNewOptionData={(inputValue, optionLabel) => ({ id: inputValue, name: optionLabel, new: true })}
                inputValue={selectInput}
                onInputChange={inputValue => setSelectInput(inputValue.substring(0, 32).toLocaleLowerCase())}
            />
            <textarea className="flex-1 form-input" placeholder="Опишите Ваш заказ..."
                value={input.description}
                onChange={event => setInput(i => ({ ...i, description: event.target.value }))}
            />
            <button className="button" onClick={() => { onCreate(input) }}>Создать заказ</button>
        </div>
    )
}

export default TaskCreateComponent;