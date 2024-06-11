"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
};

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get("/api/posts");
    setPosts(response.data);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/posts/${id}`);
    fetchPosts();
  };

  const handleEdit = (post: Post) => {
    setEditMode(true);
    setCurrentPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPost) {
      await axios.put(`/api/posts/${currentPost.id}`, { title, content });
      setEditMode(false);
      setCurrentPost(null);
      setTitle("");
      setContent("");
      fetchPosts();
    }
  };

  const handleCreatePost = () => {
    router.push("/create");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <button
        onClick={handleCreatePost}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Post
      </button>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            <div className="mt-2 space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleEdit(post)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editMode && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-gray-500 px-4 py-2 border rounded"
              />
            </div>
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="w-full bg-gray-500 px-4 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
