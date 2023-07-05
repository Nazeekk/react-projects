import React, { useEffect, useState } from "react";
import "./index.scss";
import { Collection } from "./Collection";

const categories = [
  { name: "Все" },
  { name: "Море" },
  { name: "Горы" },
  { name: "Архитектура" },
  { name: "Города" },
];

var collectionsLength = 0;

fetch(`https://64a5392f00c3559aa9bf4e1b.mockapi.io/collections`)
  .then((response) => response.json())
  .then((data) => (collectionsLength = data.length));

function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [collections, setCollections] = useState([]);
  const limit = 3;

  useEffect(() => {
    const category = categoryId ? `category=${categoryId}` : "";
    setLoading(true);
    fetch(
      `https://64a5392f00c3559aa9bf4e1b.mockapi.io/collections?page=${page}&limit=${limit}&${category}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCollections(data);
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => setLoading(false));
  }, [categoryId, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category, index) => (
            <li
              onClick={() => setCategoryId(index)}
              className={categoryId === index ? "active" : ""}
              key={index}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Загрузка...</h2>
        ) : (
          collections
            .filter((item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item, index) => (
              <Collection name={item.name} images={item.photos} key={index} />
            ))
        )}
      </div>
      <ul className="pagination">
        {[...Array(Math.ceil(collectionsLength / limit))].map((_, i) => (
          <li
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
