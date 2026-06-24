import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const POSTS_PER_PAGE = 12;

const WritingList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Writing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Practical notes on AI agents, product engineering, cloud, and startup systems.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading posts...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentPosts.map((post) => (
                  <Card 
                    key={post.slug}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="h-full group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  >
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric",
                            year: "numeric"
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-base">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-6">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-normal">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="font-normal">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                <div className="text-center py-20 text-muted-foreground border border-dashed rounded-xl">
                  No blog posts found.
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingList;
