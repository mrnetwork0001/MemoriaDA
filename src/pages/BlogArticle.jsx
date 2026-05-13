import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getArticleBySlug, BLOG_ARTICLES } from './blogContent';
import './BlogArticle.css';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = getArticleBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="article-not-found">
        <div className="not-found-inner">
          <h1 className="heading-font">404 // ARTICLE_NOT_FOUND</h1>
          <p className="terminal-font">The requested dispatch does not exist in the neural archive.</p>
          <Link to="/blog" className="back-link terminal-font">← RETURN_TO_BLOG</Link>
        </div>
      </div>
    );
  }

  // Find prev/next articles
  const currentIdx = BLOG_ARTICLES.findIndex(a => a.slug === slug);
  const prevArticle = currentIdx > 0 ? BLOG_ARTICLES[currentIdx - 1] : null;
  const nextArticle = currentIdx < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIdx + 1] : null;

  // Copy code blocks after render
  useEffect(() => {
    const timer = setTimeout(() => {
      const wrappers = document.querySelectorAll('.article-body .code-block-wrapper');
      wrappers.forEach(wrapper => {
        const header = wrapper.querySelector('.code-header');
        const codeBlock = wrapper.querySelector('.code-block');
        if (header && codeBlock && !header.querySelector('.auto-copy-btn')) {
          const btn = document.createElement('button');
          btn.className = 'copy-btn auto-copy-btn';
          btn.innerText = 'COPY';
          btn.onclick = () => {
            navigator.clipboard.writeText(codeBlock.innerText.trim());
            btn.innerText = 'COPIED!';
            btn.classList.add('copied');
            setTimeout(() => { btn.innerText = 'COPY'; btn.classList.remove('copied'); }, 2000);
          };
          header.appendChild(btn);
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="article-page">
      {/* Decorative side rail */}
      <div className="article-rail-left">
        <div className="rail-line" />
        <div className="rail-dots">
          {BLOG_ARTICLES.map((a, i) => (
            <div
              key={a.id}
              className={`rail-dot ${a.slug === slug ? 'active' : ''}`}
              title={a.title}
              onClick={() => navigate(`/blog/${a.slug}`)}
            />
          ))}
        </div>
        <div className="rail-line" />
      </div>

      {/* Header */}
      <header className="article-header">
        <div className="article-header-inner">
          <Link to="/blog" className="article-back terminal-font">← BLOG</Link>
          <Link to="/" className="article-logo heading-font">MEMORIA_DA</Link>
          <div className="article-progress terminal-font">
            {String(currentIdx + 1).padStart(2, '0')} / {String(BLOG_ARTICLES.length).padStart(2, '0')}
          </div>
        </div>
      </header>

      {/* Article Hero */}
      <div className="article-hero">
        <div className="article-hero-cover">
          <div className="hero-cover-grid" />
          <div className="hero-cover-label heading-font">{article.coverLabel}</div>
          <div className="hero-cover-scanline" />
        </div>
        <div className="article-hero-content">
          <div className="article-tags terminal-font">
            {article.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <h1 className="article-title heading-font">{article.title}</h1>
          <p className="article-subtitle terminal-font">{article.subtitle}</p>
          <div className="article-meta terminal-font">
            <div className="meta-item">
              <span className="meta-label">AUTHOR_</span>
              <span className="meta-value">{article.author}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">DATE_</span>
              <span className="meta-value">{article.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">READ_</span>
              <span className="meta-value">{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <article className="article-body-wrapper">
        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      {/* Navigation */}
      <nav className="article-nav">
        {prevArticle ? (
          <Link to={`/blog/${prevArticle.slug}`} className="nav-link nav-prev">
            <span className="nav-dir terminal-font">← PREV</span>
            <span className="nav-title heading-font">{prevArticle.title}</span>
          </Link>
        ) : <div />}
        {nextArticle ? (
          <Link to={`/blog/${nextArticle.slug}`} className="nav-link nav-next">
            <span className="nav-dir terminal-font">NEXT →</span>
            <span className="nav-title heading-font">{nextArticle.title}</span>
          </Link>
        ) : <div />}
      </nav>

      <footer className="article-footer terminal-font">
        <Link to="/" className="footer-brand-link">
          <span className="heading-font">MEMORIA_DA</span>
        </Link>
        <span>© 2026 MRNETWORK</span>
      </footer>
    </div>
  );
};

export default BlogArticle;
