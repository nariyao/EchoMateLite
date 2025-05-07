import React from "react"
import { Link } from "react-router-dom"
import style from "./navbar.module.css"
import SearchBar from "./SearchBar"
import { user } from "./iNavbar"


const navbar: React.FC<{ userDetails?: user }> = ({ userDetails }) => {
    const user = userDetails?.username || "Test";
    const handleSearch = (query: string, results: any) => {
        console.log(`Search query: ${query}`);
        console.log('Search results:', results);
        // serachResult(results
        // Do something with the results, like updating state
    };

    return (
        <div className={style.navbar}>
            <div className={style.navbar_container}>
                <div className={style.navbar_left}>
                    <Link to="/" className={style.navbar_logo}>
                        <span>EchoMateLite</span>
                    </Link>
                </div>
                <SearchBar
                    onSearch={handleSearch}
                    apiEndpoint="https://your-api-url.com/search"
                />
                <div className={style.navbar_right}>
                    <Link to="/" className={style.navbar_link}>
                        <span>Home </span>
                        <i className="fa-solid fa-home"></i>
                    </Link>
                    <Link to="/profile/" className={style.navbar_link}>
                        <span>{user} </span>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                    <Link to="/login" className={style.navbar_link}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default navbar;