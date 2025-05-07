interface CreatePostProps {
    onSubmit: (data: PostData) => Promise<void>;
    maxImageSize?: number; // in MB
    maxImages?: number;
    className?: string;
}

interface PostData {
    message: string;
    images: File[];
}

interface ImagePreview {
    id: string;
    url: string;
    file: File;
}

interface UserDetails {
    readonly UserId: string;
    readonly Name: string;
    readonly ProfileImage: string;
}

interface Post {
    readonly PostId: string;
    readonly UserDetails: UserDetails;
    readonly DateTime: string;
    readonly Likes: number;
    readonly Message: string;
    readonly imageIDs: readonly string[];
    readonly isDeleted: boolean;
}

interface PostsProps {
    post: Post;
    onLikeClick?: (postId: string) => void;
    onProfileClick?: (userId: string) => void;
}

export type {
    CreatePostProps,
    PostData,
    ImagePreview,
    UserDetails,
    Post,
    PostsProps,
};
