import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_ARTICLES } from './blogContent';
import './Blog.css';

const Blog = () => {
  const featured = BLOG_ARTICLES.find(a => a.featured);
  const rest = BLOG_ARTICLES.filter(a => !a.featured);

  return (
    <div className="blog-page">
      <header className="blog-header">
        <div className="blog-header-inner">
          <Link to="/" className="blog-logo-link">
            <div className="blog-logo heading-font">MEMORIA_DA</div>
          </Link>
          <nav className="blog-nav terminal-font">
            <Link to="/app" className="blog-nav-link">SYSTEM</Link>
            <Link to="/docs" className="blog-nav-link">DOCS</Link>
            <span className="blog-nav-active">BLOG</span>
          </nav>
        </div>
      </header>

      <main className="blog-main">
        <div className="blog-hero-bar">
          <div className="blog-hero-label terminal-font">
            <span className="blink">●</span> MEMORIA_DA // RESEARCH_LAB
          </div>
          <h1 className="blog-hero-title heading-font">DISPATCHES FROM<br/>THE <span className="text-accent">NEURAL FRONTIER</span></h1>
          <p className="blog-hero-desc terminal-font">
            Technical deep-dives, tutorials, and updates from the MemoriaDA protocol team.
          </p>
        </div>

        {/* Featured Article */}
        {featured && (
          <section className="blog-featured">
            <div className="featured-label terminal-font">FEATURED_ARTICLE</div>
            <Link to={`/blog/${featured.slug}`} className="featured-card">
              <div className="featured-cover">
                <div className="featured-cover-label heading-font">{featured.coverLabel}</div>
                <div className="featured-cover-grid" />
              </div>
              <div className="featured-body">
                <div className="featured-tags terminal-font">
                  {featured.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h2 className="featured-title heading-font">{featured.title}</h2>
                <p className="featured-subtitle terminal-font">{featured.subtitle}</p>
                <div className="featured-meta terminal-font">
                  <span>{featured.author}</span>
                  <span className="meta-sep">·</span>
                  <span>{featured.date}</span>
                  <span className="meta-sep">·</span>
                  <span>{featured.readTime}</span>
                </div>
                <div className="featured-cta terminal-font">READ_FULL_ARTICLE__❯</div>
              </div>
            </Link>
          </section>
        )}

        {/* Article List */}
        <section className="blog-list">
          <div className="blog-list-header terminal-font">
            <span className="list-label">ALL_DISPATCHES</span>
            <span className="list-count">{BLOG_ARTICLES.length} ARTICLES</span>
          </div>
          <div className="blog-grid">
            {BLOG_ARTICLES.map((article, idx) => (
              <Link to={`/blog/${article.slug}`} key={article.id} className="blog-card">
                <div className="card-index terminal-font">{String(idx + 1).padStart(2, '0')}</div>
                <div className="card-cover-mini">
                  <span className="card-cover-label heading-font">{article.coverLabel}</span>
                </div>
                <div className="card-body">
                  <div className="card-tags terminal-font">
                    {article.tags.slice(0, 2).map(t => <span key={t} className="tag-sm">{t}</span>)}
                  </div>
                  <h3 className="card-title heading-font">{article.title}</h3>
                  <p className="card-subtitle terminal-font">{article.subtitle}</p>
                  <div className="card-meta terminal-font">
                    <span>{article.date}</span>
                    <span className="meta-sep">·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <div className="card-arrow terminal-font">❯</div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="blog-footer terminal-font">
        <Link to="/" className="footer-brand-link">
          <span className="blog-footer-brand heading-font">MEMORIA_DA // RESEARCH_LAB</span>
        </Link>
        <span className="blog-footer-copy">© 2026 MRNETWORK</span>
      </footer>
    </div>
  );
};

export default Blog;
