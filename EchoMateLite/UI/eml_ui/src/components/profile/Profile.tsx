import React, { useMemo } from 'react';
import useGetUser from './hooks/useGetUser';
import { useParams } from 'react-router-dom';
import style from './css/profile.module.css';
import Posts from '../posts/Posts';
import useGetPosts from '../posts/hooks/useGetPosts';
import { Post } from '../posts/iPosts';
import UserProfile from './UserProfile';
import { IUser } from './iProfile';

const Profile: React.FC = () => {
  const { id } = useParams();
  const userId = id || "";

  // Call hooks with user ID
  const { user, loading: userLoading, error: userError, refetch: refetchUser } = useGetUser(userId);
  const { posts: postsData, loading: postsLoading, error: postsError, refetch: refetchPosts } = useGetPosts(userId);

  // Ensure posts is always an array
  const posts = useMemo(() => (Array.isArray(postsData) ? postsData : []), [postsData]);

  // Combined loading state
  const isLoading = userLoading || postsLoading;

  // Handle error states
  const error = userError || postsError;

  // Combined refetch function
  const refetchAll = async () => {
    await Promise.all([refetchUser(), refetchPosts()]);
  };

  // Memoize the posts list to prevent unnecessary re-renders
  const postsList = useMemo(() => {
    if (!Array.isArray(posts)) {
      return null;
    }
    return posts.map((post: Post) => (
      <Posts key={post.PostId} post={post} />
    ));
  }, [posts]);

  if (isLoading) {
    return <div className={style.loading}>Loading data...</div>;
  }

  if (error) {
    return (
      <div className={style.error}>
        <p>Error: {error.message}</p>
        <button onClick={refetchAll}>Try Again</button>
      </div>
    );
  }

  if (!user) {
    return <div className={style.not_found}>User not found</div>;
  }

  return (
    <div className={style.profile}>
      <div className={style.profile_details}>
        <UserProfile user={user} />
      </div>
      <div className={style.posts_container}>
        <h2>Posts</h2>
        {!posts.length ? (
          <p>No posts available</p>
        ) : (
          postsList
        )}
      </div>
    </div>
  );
};

export default Profile;
