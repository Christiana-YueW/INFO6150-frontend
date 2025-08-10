import { useState, useEffect } from "react";
import "../styles/browse.css"
import ItemModal from "../components/ItemModal";

function BrowsePage({items = []}) {

    const [searchText, setSearchText] = useState("");
    const [locationFilter, setLocationFilter] = useState("All");
    const [sortOption, setSortOption] = useState("name-asc");
    const [activeItem, setActiveItem] = useState(null);

    function getLocationOptions() {
        const set = new Set();
        items.forEach((it) => set.add(it.location));
        return ["All", ...Array.from(set)];

    }

    //search
    function matchSearch(it) {
        const search = searchText.trim().toLowerCase();

        if (!searchText.trim()) return true;
        return (
            it.name.toLowerCase().includes(search) ||
            it.location.toLowerCase().includes(search)
        );
    }

    //filter by dropdown
    function matchLocation(it) {
        if (locationFilter === "All") return true;
        return it.location === locationFilter;
    }

    function sortItems(a, b) {

        const [key, dir] = sortOption.split("-");
        const aVal = key === "name" ? a.name.toLowerCase() : a.location.toLowerCase();
        const bVal = key === "name" ? b.name.toLowerCase() : b.location.toLowerCase();

        if (aVal < bVal) return dir === "asc" ? -1 : 1;
        if (aVal > bVal) return dir === "asc" ? 1 : -1;
        return 0;
    }

    //visual list
    const visible = [...items]
        .filter(matchSearch)
        .filter(matchLocation)
        .sort(sortItems);

    function handleCardOpen(item) {
        setActiveItem(item);
    }

    function handleModalClose() {
        setActiveItem(null);
    }

    //render
    return (

        <section className="browse-page">
            <h2> Browse My Items </h2>

            <form className="browse-controls" onSubmit={(e) => e.preventDefault()}>
                <div className="control">
                    <label htmlFor="browse-search"> Search </label>
                    <input
                        id="browse-search"
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by name🏷️  or location📍"
                    />
                </div>

                <div className="control">
                    <label htmlFor="browse-filter">
                        Filter By Location:
                    </label>

                    <select
                        id="browse-filter"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        {getLocationOptions().map((loc) => (

                            <option key={loc} value={loc}> {loc} </option>

                        ))}
                    </select>

                </div>

                <div className="control">
                    <label htmlFor="browse-sort">
                        Sort:
                    </label>

                    <select
                        id="browse-sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >

                        <option value="name-asc">Name (A → Z)</option>
                        <option value="name-desc">Name (Z → A)</option>
                        <option value="loc-asc">Location (A → Z)</option>
                        <option value="loc-desc">Location (Z → A)</option>

                    </select>

                </div>
            </form>

            <ul className="card-grid" aria-live="polite">
                {visible.length === 0 && (
                    <li className="empty-result"> No items match. </li>
                )}

                {visible.map((item) => (
                    <li key={item.id} className="card" role="article">
                        <button
                            className="card-title"
                            onClick={() => handleCardOpen(item)}
                            aria-label={`View details for ${item.name}`}
                        >
                            <img
                               src={item.photo || "/placeholder.png"}
                               alt={item.photo ? item.name : `${item.name} (no photo)`}

                            />

                        </button>

                        <div className="card-body">
                            <h3 className="card-title">{item.name}</h3>
                            <p className="card-meta">
                                <strong>Location:</strong> {item.location}
                            </p>

                            <div className="card-actions">
                                <button
                                  className="btn-link"
                                  onClick={() => handleCardOpen(item)}
                                >
                                  Details
                                </button>
                            </div>

                        </div>

                    </li>
                ))}

            </ul>
            <ItemModal item={activeItem} onClose={handleModalClose} />

        </section>

    )

}

export default BrowsePage;