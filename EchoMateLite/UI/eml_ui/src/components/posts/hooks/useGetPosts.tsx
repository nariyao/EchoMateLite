import { useState, useEffect } from "react";
import { Post } from "../iPosts";
import axios from "axios";

interface UseGetPostsResult {
    posts: Post[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const useGetPosts = (userId: string): UseGetPostsResult => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPosts = async (): Promise<void> => {
        if (!userId) {
            setPosts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/api/post/${userId}`);
            const postsArray = Array.isArray(response.data)
                ? response.data
                : (response.data.posts || []);
            // With axios, data is already parsed as JSON
            setPosts(postsArray);

        } catch (err) {
            console.error('Error fetching posts:', err);

            // Handle axios errors properly
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setError(new Error(`Server error: ${err.response.status} ${err.response.statusText}`));
                } else if (err.request) {
                    // The request was made but no response was received
                    setError(new Error('No response received from server. Please check your network connection.'));
                } else {
                    // Something happened in setting up the request
                    setError(new Error(`Request error: ${err.message}`));
                }
            } else {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            }

            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts
    };
};

export default useGetPosts;
