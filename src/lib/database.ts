
import { supabase } from "@/integrations/supabase/client";

// Posts
export const getPosts = async ({ tags = [], searchQuery = '' }) => {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (searchQuery) {
    query = query.or(`content.ilike.%${searchQuery}%, tags.cs.{${searchQuery}}`);
  }
  
  if (tags.length > 0) {
    // Filter posts that contain ALL selected tags
    tags.forEach(tag => {
      query = query.contains('tags', [tag]);
    });
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data;
};

export const createPost = async ({ content, tags, imageUrl = null }) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        content,
        tags,
        image_url: imageUrl,
        anonymous_id: generateAnonymousId(),
      },
    ])
    .select();
  
  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }
  
  return data?.[0];
};

// Generate a consistent anonymous ID for a user
const generateAnonymousId = () => {
  // In a real app, this would use the authenticated user's ID to generate a consistent hash
  return Math.random().toString(36).substring(2, 10);
};

// Notifications
export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  
  return data;
};

// Update post likes/dislikes/comments
export const updatePostEngagement = async (postId, field, value) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ [field]: value })
    .eq('id', postId)
    .select();
    
  if (error) {
    console.error(`Error updating post ${field}:`, error);
    throw error;
  }
  
  return data?.[0];
};

// Get trending tags
export const getTrendingTags = async (limit = 5) => {
  const { data, error } = await supabase
    .from('posts')
    .select('tags');
    
  if (error) {
    console.error('Error fetching tags for trending:', error);
    return [];
  }
  
  // Count tag occurrences and sort by popularity
  const tagCounts = {};
  data.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  // Convert to array and sort
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
};

// Comments
export const getComments = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return data;
};

export const createComment = async ({ postId, content, parentId = null }) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        content,
        parent_id: parentId,
        anonymous_id: generateAnonymousId(),
      },
    ])
    .select();
  
  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
  
  // Also increment the comments count on the post
  await updatePostEngagement(postId, 'comments', await getCommentCount(postId));
  
  return data?.[0];
};

// Helper to get comment count for a post
export const getCommentCount = async (postId) => {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
    
  if (error) {
    console.error('Error counting comments:', error);
    return 0;
  }
  
  return count || 0;
};
