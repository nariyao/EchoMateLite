import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import style from "./posts.module.css";
import { Post, PostsProps } from "./iPosts";

// Optimized date formatter
const formatDateTime = (dateTime: string): string => {
  try {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateTime;
  }
};

// Image loading optimization component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = memo(({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/loading.gif'; // Add a fallback image
        target.onerror = null; // Prevent infinite loop
      }}
    />
  );
});

LazyImage.displayName = 'LazyImage';

// Main Posts component
const Posts: React.FC<PostsProps> = memo(({ post, onLikeClick, onProfileClick }) => {
  // Memoize formatted date to prevent unnecessary recalculations
  const formattedDateTime = useMemo(() => formatDateTime(post.DateTime), [post.DateTime]);

  // Memoize image gallery rendering
  const imageGallery = useMemo(() => {
    if (post.imageIDs.length === 0) return null;

    return (
      <div className={`${style.post_image} ${post.imageIDs.length > 1 ? style.grid : ''}`}>
        {post.imageIDs.map((imageID) => (
          <LazyImage
            key={imageID}
            src={imageID}
            alt={`${post.UserDetails.Name}'s post`}
            className={style.post_image_item}
          />
        ))}
      </div>
    );
  }, [post.imageIDs, post.UserDetails.Name]);

  // Handle like click with error boundary
  const handleLikeClick = () => {
    try {
      onLikeClick?.(post.PostId);
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  // Handle profile click with error boundary
  const handleProfileClick = () => {
    try {
      onProfileClick?.(post.UserDetails.UserId);
    } catch (error) {
      console.error('Error handling profile click:', error);
    }
  };

  if (post.isDeleted) {
    return (
      <div className={`${style.container} ${style.deleted}`}>
        <p>This post has been deleted</p>
      </div>
    );
  }

  return (
    <article className={style.container}>
      <header className={style.post_header}>
        <Link
          to={`/profile/${post.UserDetails.UserId}`}
          className={style.author_link}
          onClick={handleProfileClick}
        >
          <div className={style.author_img}>
            <LazyImage
              src={post.UserDetails.ProfileImage}
              alt={post.UserDetails.Name}
            />
          </div>
          <div className={style.post_author_name}>
            <h3>{post.UserDetails.Name}</h3>
            <time dateTime={post.DateTime} className={style.post_date_time}>{formattedDateTime}</time>
          </div>
        </Link>
      </header>

      {post.Message && (
        <div className={style.post_body}>
          <p>{post.Message}</p>
        </div>
      )}

      {imageGallery}

      <footer className={style.post_actions}>
        <button
          className={style.like_button}
          onClick={handleLikeClick}
          aria-label="Like post"
        >
          <span className={style.like_count}>{post.Likes}</span>
          <span>Likes</span>
        </button>
      </footer>
    </article>
  );
});

Posts.displayName = 'Posts';

export default Posts;
