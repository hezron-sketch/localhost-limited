import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function BlogTab() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
  });

  const { data: posts, isLoading, refetch } = trpc.cms.blog.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const createMutation = trpc.cms.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      setShowForm(false);
      setFormData({ title: "", slug: "", content: "" });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create blog post");
    },
  });

  const deleteMutation = trpc.cms.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete blog post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData as any);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ title: "", slug: "", content: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Blog Posts</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-black gap-2"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mx-auto" />
          <p className="text-white/60 mt-2">Loading blog posts...</p>
        </div>
      ) : !posts?.posts || posts.posts.length === 0 ? (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-8 text-center">
          <p className="text-white/60">No blog posts yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.posts.map((post: any) => (
            <div
              key={post.id}
              className="bg-[#0A1628] border border-white/10 rounded-lg p-6 hover:border-[#22C55E]/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-white/70 text-sm mb-3">/{post.slug}</p>
                  <p className="text-white/60 text-sm line-clamp-2">{post.content}</p>
                </div>
                <Button
                  onClick={() => deleteMutation.mutate({ id: post.id })}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-400 hover:text-red-300 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-[#0A1628] border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">Create New Blog Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-slug"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Post content..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 min-h-32"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
              <Button type="submit" className="bg-[#22C55E] hover:bg-[#16A34A] text-black" disabled={createMutation.isPending}>
                {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "Save Post"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
