import React, { useState, useCallback, useRef } from 'react';
import style from './createPost.module.css';
import { CreatePostProps, ImagePreview } from "./iPosts";

const DEFAULT_MAX_IMAGE_SIZE = 5; // 5MB
const DEFAULT_MAX_IMAGES = 4;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const CreatePost: React.FC<CreatePostProps> = ({
  onSubmit,
  maxImageSize = DEFAULT_MAX_IMAGE_SIZE,
  maxImages = DEFAULT_MAX_IMAGES,
  className = ''
}) => {
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle image validation and preview
  const validateAndPreviewImage = useCallback((file: File): Promise<ImagePreview> => {
    return new Promise((resolve, reject) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        reject(new Error('Invalid image type'));
        return;
      }

      if (file.size > maxImageSize * 1024 * 1024) {
        reject(new Error(`Image size should be less than ${maxImageSize}MB`));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: crypto.randomUUID(),
          url: e.target?.result as string,
          file
        });
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  }, [maxImageSize]);

  // Handle image selection
  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || []);

      if (images.length + files.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const imagePromises = files.map(validateAndPreviewImage);
      const newImages = await Promise.all(imagePromises);

      setImages(prev => [...prev, ...newImages]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process images');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images.length, maxImages, validateAndPreviewImage]);

  // Handle image removal
  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && images.length === 0) {
      setError('Please add a message or image');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await onSubmit({
        message: message.trim(),
        images: images.map(img => img.file)
      });

      // Reset form
      setMessage('');
      setImages([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={`${style.post_create_container} ${className}`}
      onSubmit={handleSubmit}
      aria-label="Create post form"
    >
      <span>Create Post</span>
      <div className={style.post_actions}>
        <div className={style.image_upload}>
          <label
            htmlFor="post_image_input"
            className={style.image_upload_label}
          >
            <i className="fa-solid fa-image"></i>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="post_image_input"
            className={style.image_upload_input}
            onChange={handleImageSelect}
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            multiple
            disabled={isSubmitting || images.length >= maxImages}
          />
        </div>
        <div className={style.post_message}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What is on your mind?"
            className={style.post_message_input}
            disabled={isSubmitting}
            aria-label="Post message"
          />
        </div>

        <button
          type="submit"
          className={style.post_submit_button}
          disabled={isSubmitting || (!message.trim() && images.length === 0)}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
      {images.length > 0 && (
        <div className={style.image_previews}>
          {images.map(img => (
            <div key={img.id} className={style.image_preview_container}>
              <img
                src={img.url}
                alt="Preview"
                className={style.image_preview}
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className={style.remove_image}
                aria-label="Remove image"
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={style.error_message} role="alert">
          {error}
        </div>
      )}
    </form >
  );
};


export default CreatePost;
