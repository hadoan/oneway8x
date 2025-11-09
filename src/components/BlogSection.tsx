import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  readTime: string;
}

const POSTS_PER_PAGE = 20;

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      // Import all markdown files from the blog content directory
      const modules = import.meta.glob("/src/content/blog/*.md", { as: "raw" });
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
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const frontmatter: any = {};
    const lines = match[1].split("\n");

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

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

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
    <section className="py-20 px-4" id="blog">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">My Blog</h2>
          <p className="text-lg text-muted-foreground">
            Insights on development, DevOps, and cloud technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <Card className="h-full group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric",
                        year: "numeric"
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
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
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
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