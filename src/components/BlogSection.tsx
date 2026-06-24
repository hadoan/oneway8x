import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  readTime: string;
}

// Removed POSTS_PER_PAGE constant as we only show 3 on homepage

const BlogSection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      // Import all markdown files from the blog content directory
      const modules = import.meta.glob("/src/content/blog/*.md", { query: "?raw", import: "default" });
      const posts: BlogPost[] = [];

      for (const path in modules) {
        const content = await modules[path]();
        const slug = path.split("/").pop()?.replace(".md", "") || "";
        const frontmatter = parseFrontmatter(content);
        
        posts.push({
          slug,
          title: frontmatter.title || "Untitled",
          date: frontmatter.date || "",
          author: frontmatter.author || "Anonymous",
          excerpt: frontmatter.excerpt || "",
          tags: frontmatter.tags || [],
          readTime: calculateReadTime(content),
        });
      }

      // Sort by date (newest first)
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setLoading(false);
    }
  };

  const parseFrontmatter = (content: string) => {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};

    const frontmatter: any = {};
    const lines = match[1].split(/\r?\n/);

    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length) {
        const value = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
        
        // Handle arrays (tags)
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

  const currentPosts = posts.slice(0, 3);

  if (loading) {
    return (
      <section className="py-20 px-4" id="blog">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4" id="blog">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl font-bold tracking-tight">Writing</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Notes and tutorials on AI agents, product engineering, cloud, and startup systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {currentPosts.map((post) => (
            <Card 
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="h-full group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{new Date(post.date).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric",
                      year: "numeric"
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 mt-2 text-sm">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {posts.length > 3 && (
          <div className="flex justify-center mt-8 md:mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/writing')}
              className="px-8"
            >
              View all writing
            </Button>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center text-muted-foreground">
            No blog posts found. Add markdown files to src/content/blog/ to get started.
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;