import { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, MessageCircle, Send, Image, User, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useUpload } from '@/hooks/useUpload';

interface Post {
  id: number;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  building_name?: string;
  content: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

function PostCard({ post, onLike, onComment }: { 
  post: Post; 
  onLike: (id: number) => void;
  onComment: (id: number, content: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    setLiking(true);
    await onLike(post.id);
    setLiking(false);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    await onComment(post.id, commentText);
    setCommentText('');
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return `${Math.floor(diff / 86400)}天前`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      {/* User Info */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center text-white font-bold">
          {post.user_avatar ? (
            <img src={post.user_avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            post.user_name.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-[#1d3557]">{post.user_name}</div>
          {post.building_name && (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {post.building_name} · {timeAgo(post.created_at)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`px-4 pb-3 grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((img, i) => (
            <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-6 border-t border-gray-50">
        <button 
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 text-sm ${post.is_liked ? 'text-[#e63946]' : 'text-gray-500'}`}
        >
          <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
          {post.likes_count || '赞'}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-gray-500"
        >
          <MessageCircle className="w-5 h-5" />
          {post.comments_count || '评论'}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3 border-t border-gray-50 pt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写评论..."
              className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]/20"
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
            />
            <button 
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="p-2 bg-[#e63946] text-white rounded-full disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckIn() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { user } = useAuth();
  const { uploadMultiple } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          id, 
          user_id, 
          content, 
          images, 
          likes_count, 
          comments_count, 
          created_at,
          building_id,
          buildings(name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithUserInfo = await Promise.all(
        postsData.map(async (post) => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', post.user_id)
            .single();

          const { data: likeData, error: likeError } = await supabase
            .from('likes')
            .select('id')
            .eq('user_id', user?.id)
            .eq('check_in_id', post.id);

          return {
            id: post.id,
            user_id: post.user_id,
            user_name: profile?.username || '用户',
            user_avatar: profile?.avatar_url,
            building_name: post.buildings?.name,
            content: post.content,
            images: post.images || [],
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            is_liked: !likeError && likeData?.length > 0,
            created_at: post.created_at,
          };
        })
      );

      setPosts(postsWithUserInfo);
    } catch (err) {
      console.error('Fetch posts error:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 9 - selectedImages.length);
    setSelectedImages([...selectedImages, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImages((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('check_in_id', postId)
        .single();

      if (existingLike) {
        await supabase.from('likes').delete().eq('id', existingLike.id);
        await supabase.rpc('decrement_checkin_likes', { check_in_id: postId });
      } else {
        await supabase.from('likes').insert({ user_id: user.id, check_in_id: postId });
        await supabase.rpc('increment_checkin_likes', { check_in_id: postId });
      }

      fetchPosts();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    if (!user) return;

    try {
      await supabase.from('comments').insert({
        user_id: user.id,
        check_in_id: postId,
        content,
      });
      await supabase.rpc('increment_checkin_comments', { check_in_id: postId });
      fetchPosts();
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const handlePublish = async () => {
    if (!user || !newPostContent.trim()) return;

    setPublishing(true);

    try {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        setUploading(true);
        imageUrls = await uploadMultiple(selectedImages, 'checkins', `posts/${user.id}`);
        setUploading(false);
      }

      await supabase.from('posts').insert({
        user_id: user.id,
        content: newPostContent,
        images: imageUrls.length > 0 ? imageUrls : null,
        status: 'approved',
      });

      setNewPostContent('');
      setSelectedImages([]);
      setPreviewImages([]);
      fetchPosts();
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fef6f6' }}>
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm">
        <h1 className="text-xl font-bold text-[#1d3557]">社区</h1>
        <p className="text-sm text-gray-500">大家的打卡之旅</p>
      </header>

      {/* Create Post */}
      {user && (
        <div className="px-4 py-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center text-white font-bold">
                {user.email?.charAt(0).toUpperCase() || '👤'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="分享你的打卡之旅..."
                  className="w-full text-sm resize-none focus:outline-none min-h-[60px]"
                  rows={2}
                />
                
                {/* Preview Images */}
                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={selectedImages.length >= 9}
                      className="text-gray-400 hover:text-[#e63946] disabled:opacity-50"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#e63946] hover:bg-[#c1121f] rounded-full px-4"
                    disabled={!newPostContent.trim() || uploading || publishing}
                    onClick={handlePublish}
                  >
                    {(uploading || publishing) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      '发布'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      <section className="px-4 py-2">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">暂无动态</p>
            <p className="text-sm text-gray-400">快去打卡分享你的旅程吧</p>
          </div>
        )}
      </section>

      {/* Load More */}
      <div className="text-center py-4">
        <button className="text-sm text-gray-500 hover:text-[#e63946]">
          加载更多...
        </button>
      </div>
    </div>
  );
}
