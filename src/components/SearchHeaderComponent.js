import "./SearchHeaderComponent.scss";
import searchIcon from "../svg/search-icon.svg"
import filterIcon from "../svg/filter-icon.svg"
import filterIconActive from "../svg/filter-icon.active.svg"
import { useState } from "react";

function SearchHeaderComponent(props) {
    const [showFilters, toggleFilters] = useState(false);

    function RenderFiltersList() {
        return (
            <div className="filters-conatiner">
                {props.filters.map((filter) => (
                    <div key={filter.value}
                        className={"option" + (filter.value === props.selectedFilter ? " selected" : "")}
                        onClick={() => { toggleFilters(false); props.onFilterChange(filter.value); }}
                    >{filter.label}</div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex-row header">
            <div className="flex-row flex-1 header-content">
                <div className="filter-button" onClick={() => toggleFilters(!showFilters)}>
                    <img src={showFilters ? filterIconActive : filterIcon} className="filter-icon" alt="list" />
                </div>
                <div className="flex-row flex-1 search-container">
                    <input className="flex-1 form-input" type="text" placeholder="Поиск задач" onChange={props.onInputChange} />
                    <img src={searchIcon} className="search-icon" alt="list" />
                </div>
                {showFilters ? RenderFiltersList() : null}
            </div>
        </div>)
}

export default SearchHeaderComponent;