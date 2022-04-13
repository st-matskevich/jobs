import "./TaskCreatePage.scss";
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useTags } from "../api/backend";
import { useHistory } from "react-router-dom";
import { CreateTask } from "../api/backend";
import { logAnalyticsEvent, ANALYTICS_EVENTS } from "../api/firebase"

function TaskCreatePage() {
    const [input, setInput] = useState({
        name: "",
        description: "",
        tags: []
    });

    const [selectInput, setSelectInput] = useState("");
    const history = useHistory();
    const tags = useTags(selectInput);

    function OnCreateTask(input) {
        if (!input.name)
            return;

        if (input.name.length > 128)
            return;

        if (!input.tags)
            return;

        if (input.tags.length < 1)
            return;

        if (input.tags.length > 5)
            return;

        if (!input.description)
            return;

        if (input.description.length > 2048)
            return;

        CreateTask({
            name: input.name,
            description: input.description,
            tags: input.tags.map(tag => ({ ...tag, id: tag.new ? "MA==" : tag.id }))
        }).then(function () {
            logAnalyticsEvent(ANALYTICS_EVENTS.CREATE_TASK);
            history.push("/tasks");
        }).catch(function (error) {
            //TODO: handle errors
            console.log(error);
        });
    }

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
                getOptionLabel={option => option.text}
                getOptionValue={option => option.id}
                formatCreateLabel={inputValue => "Создать тег \"" + inputValue + "\""}
                getNewOptionData={(inputValue, optionLabel) => ({ id: inputValue, text: optionLabel, new: true })}
                inputValue={selectInput}
                onInputChange={inputValue => setSelectInput(inputValue.substring(0, 32).toLocaleLowerCase())}
            />
            <textarea className="flex-1 form-input" placeholder="Опишите Ваш заказ..."
                value={input.description}
                onChange={event => setInput(i => ({ ...i, description: event.target.value }))}
            />
            <button className="button" onClick={() => { OnCreateTask(input) }}>Создать заказ</button>
        </div>
    )
}

export default TaskCreatePage;