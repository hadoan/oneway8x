import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PostData {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  content: string;
  readTime: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const response = await import(`../content/blog/${slug}.md?raw`);
      const content = response.default;
      
      const frontmatter = parseFrontmatter(content);
      const markdownContent = content.replace(/^---\n[\s\S]*?\n---\n/, "");
      
      setPost({
        title: frontmatter.title || "Untitled",
        date: frontmatter.date || "",
        author: frontmatter.author || "Anonymous",
        excerpt: frontmatter.excerpt || "",
        tags: frontmatter.tags || [],
        content: markdownContent,
        readTime: calculateReadTime(markdownContent),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading post:", error);
      setLoading(false);
    }
  };

  const parseFrontmatter = (content: string) => {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const frontmatter: any = {};
    const lines = match[1].split("\n");

    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length) {
        const value = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
        
        if (value.startsWith("[") && value.endsWith("]")) {
          frontmatter[key.trim()] = value
            .slice(1, -1)
            .split(",")
            .map((item) => item.trim().replace(/^["']|["']$/g, ""));
        } else {
          frontmatter[key.trim()] = value;
        }
      }
    });

    return frontmatter;
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Post not found</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <header className="mb-8">
            <h1 className="mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <span>By {post.author}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div className="markdown-content prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;