import React, { useEffect, useState } from 'react'
import CreatePost from '../posts/CreatePost'
import Posts from "../posts/Posts";
import testData from './test-data.json'
import style from './feeds.module.css'


const Feeds: React.FC = () => {
    const [feeds, setFeeds] = useState(testData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchFeeds = async () => {
            setLoading(true);
            try {
                const response = await fetch('XXXXXXXXXXXXXXXXXXXXXXXXXXX');
                const data = await response.json();
                setFeeds(data);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };
        fetchFeeds();
    }, []);
    return (
        <div className={style.feeds}>
            <div className={style.create_posts}>
                <CreatePost />
            </div>
            <div className={style.feeds_container}>
                {feeds.map((post) => (
                    <Posts key={post.PostId} post={post} />
                ))}
            </div>
        </div>
    )
}

export default Feeds
