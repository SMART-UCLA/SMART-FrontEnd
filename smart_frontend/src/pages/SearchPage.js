import './App.css';
import React, { useState } from "react";
import buckets_data from "./../buckets.json"
import { Link } from "react-router-dom";

// const filterNodes = (searchText, maxResults) => {
//     return JSONDATA.data.filter((id) => {
//       // returns true if condition is met, otherwise returns false
//       return id.toLowerCase().includes(searchText.toLowerCase());
//     }).slice(0, maxResults);
//   }

function SearchPage() {
  
    const [searchTerm, setSearchTerm] = useState("");
  return (
      <div className = "bg-white left-0 mt-[96px]">
    <div className="App">
      <h3>Basic Search Filter React Tutorial</h3>
      <input
        type="text"
        placeholder="Search Here"
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
      {buckets_data.data.filter((value) => {
        if (searchTerm === "") {
          return value;
        } else if (
          value.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return value;
        }
        return null;
      }).map((val, key) => {
        return (
          <div className="user" key={key}>
            <li class="mx-[6px]">
              <Link to={{
                pathname: "/TestGraph",
                state: val
                }}>
                  <b>{val}</b></Link>
            </li>
          </div>
        );
      })}
    </div>
    </div>
  );
}

export default SearchPage;
