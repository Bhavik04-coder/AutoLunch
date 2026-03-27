/**
 * Posts store — re-exports both the Context-based usePosts (for simple reads)
 * and the API-backed usePostsApi (for full CRUD with loading/error states).
 */
export { usePosts } from '@/contexts/PostsContext';
export { usePostsApi } from '@/hooks/usePosts';
