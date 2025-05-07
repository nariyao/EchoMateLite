import React, { useEffect, useState } from 'react'
import CreatePost from '../posts/CreatePost'
import Posts from "../posts/Posts";
import style from './feeds.module.css'
import axios from 'axios';
import { Post as IPost } from '../posts/iPosts';
// import testData from './test-data.json'


const Feeds: React.FC = () => {
    const [feeds, setFeeds] = useState<IPost[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const onSubmit = async (data: { message: string, images: File[] }) => {
        try {
            setLoading(true)
            const response = await axios.post("/feeds", data);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                // console.log(error);
                setError(error);
                return error;
            }
        } finally {
            setLoading(false);
        }
        console.log(error);
    };


    const feedList = () => {
        if (!feeds) {
            return (<div className={style.loading}>
                <img src='/loading.gif' alt="loading" />
                <br />
                Loading...
            </div>)
        }
        return feeds.map((post: IPost) => (
            <Posts key={post.PostId} post={post} />
        ))
    }

    useEffect(() => {
        const fetchFeeds = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/feeds");
                setFeeds(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error);
                }
            }
            setLoading(false);
        };
        fetchFeeds();
    }, [loading]);
    return (
        <div className={style.feeds}>
            {error && <div className={style.error}>{error.message}</div>}
            <div className={style.create_posts}>
                <CreatePost onSubmit={onSubmit} />
            </div>
            <div className={style.feeds_container}>
                {feedList()}
            </div>
        </div>
    )
}

export default Feeds
