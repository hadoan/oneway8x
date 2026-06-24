import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const GiscusComments = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine actual theme for Giscus
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const giscusTheme = currentTheme === 'dark' ? 'dark_dimmed' : 'light';

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-2xl font-bold tracking-tight mb-8">Comments</h3>
      <Giscus
        id="comments"
        repo="hadoan/oneway8x"
        repoId="R_kgDOQSfE6g"
        category="Announcements"
        categoryId="DIC_kwDOQSfE6s4C_yPs"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
      />
    </div>
  );
};

export default GiscusComments;
