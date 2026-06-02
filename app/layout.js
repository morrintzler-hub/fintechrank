import './globals.css'

export const metadata = {
  title: 'The Fintech Rank — Compare the World\'s Top 100 Fintech Companies',
  description: 'Unbiased ratings, verified pricing, and side-by-side comparisons across the world\'s top 100 fintech platforms.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>

        {/* Intro — only rendered, JS decides whether to show */}
        <div id="fr-intro" role="presentation" style={{display:'none'}}>
          <div className="intro-rule"></div>
          <div className="intro-symbols">
            <div className="intro-sym" data-sym="$">$</div>
            <div className="intro-sym" data-sym="€">€</div>
            <div className="intro-sym" data-sym="£">£</div>
            <div className="intro-sym" data-sym="₿">₿</div>
          </div>
          <div className="intro-divider"></div>
          <div className="intro-logo">
            <span className="l-main">The Fintech</span>
            <span className="l-accent">Rank</span>
            <div className="intro-glow"></div>
          </div>
          <div className="intro-tagline">Compare · Research · Decide</div>
          <div className="intro-rule-bottom"></div>
        </div>

        {/* Backgrounds */}
        <div className="bg-base" aria-hidden="true"></div>
        <div className="bg-orb orb-1" aria-hidden="true"></div>
        <div className="bg-orb orb-2" aria-hidden="true"></div>
        <div className="bg-orb orb-3" aria-hidden="true"></div>
        <div className="bg-grid" aria-hidden="true"></div>

        {/* Nav */}
        <nav className="nav" id="mainNav">
          <a href="/" className="nav-logo">
            <span className="nav-dot"></span>
            The Fintech <span className="nav-acc">Rank</span>
          </a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/compare">Compare</a>
            <a href="/category/payments">Categories</a>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <button className="theme-toggle" id="themeToggle"
              title="Toggle light/dark mode" aria-label="Toggle theme">
              🌙
            </button>
            <a href="mailto:hello@thefintechrank.com" className="nav-cta">
              Submit a Company
            </a>
          </div>
        </nav>

        <main>{children}</main>

        <footer>
          <div>
            <div className="footer-brand">The Fintech <span>Rank</span></div>
            <div className="footer-tagline">
              Independent research on the world's top 100 fintech companies.
              Updated by our community in real time.
            </div>
          </div>
          <div className="footer-links">
            <h4>Categories</h4>
            <a href="/category/payments">Payments</a>
            <a href="/category/banking">Banking</a>
            <a href="/category/investing">Investing</a>
            <a href="/category/crypto">Crypto</a>
            <a href="/category/lending">Lending</a>
            <a href="/category/business">Business</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="/compare">Compare tool</a>
            <a href="#">Methodology</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact</a>
          </div>
        </footer>
        <div className="footer-bottom">
          2025 The Fintech Rank · Independent research ·
          Affiliate disclosure: some links may earn us a commission at no extra cost to you.
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {

            // ── THEME ──────────────────────────────────────────
            var saved = localStorage.getItem('tfr_theme') || 'dark';
            if (saved === 'light') document.documentElement.classList.add('light');

            var btn = document.getElementById('themeToggle');
            function updateIcon() {
              if (btn) btn.textContent = document.documentElement.classList.contains('light') ? '☀️' : '🌙';
            }
            updateIcon();
            if (btn) {
              btn.addEventListener('click', function() {
                document.documentElement.classList.toggle('light');
                var theme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
                localStorage.setItem('tfr_theme', theme);
                updateIcon();
              });
            }

            // ── INTRO — only on homepage, only first visit ─────
            var isHome = window.location.pathname === '/' || window.location.pathname === '';
            var intro = document.getElementById('fr-intro');
            if (intro && isHome && !sessionStorage.getItem('tfr_intro_v3')) {
              sessionStorage.setItem('tfr_intro_v3', '1');
              intro.style.display = 'flex';
              document.body.style.overflow = 'hidden';
              function dismiss() {
                intro.classList.add('hide');
                setTimeout(function() {
                  intro.style.display = 'none';
                  document.body.style.overflow = '';
                }, 700);
              }
              intro.addEventListener('click', dismiss);
              setTimeout(dismiss, 2600);
            }

            // ── NAV SCROLL ─────────────────────────────────────
            var nav = document.getElementById('mainNav');
            var isLight = function() {
              return document.documentElement.classList.contains('light');
            };
            if (nav) {
              function updateNav() {
                var scrolled = window.scrollY > 20;
                nav.classList.toggle('nav-scrolled', scrolled);
                if (isLight()) {
                  nav.style.background = scrolled
                    ? 'rgba(240,244,248,0.98)'
                    : 'rgba(240,244,248,0.92)';
                  nav.style.borderBottomColor = 'rgba(0,0,0,0.1)';
                } else {
                  nav.style.background = '';
                  nav.style.borderBottomColor = '';
                }
              }
              window.addEventListener('scroll', updateNav, { passive: true });
              // Re-run when theme changes
              document.getElementById('themeToggle') && document.getElementById('themeToggle').addEventListener('click', function() {
                setTimeout(updateNav, 50);
              });
            }

            // ── SCROLL ANIMATIONS ──────────────────────────────
            function initObserver() {
              var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                  if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    e.target.querySelectorAll('.score-bar-fill').forEach(function(b) {
                      b.classList.add('animate');
                    });
                    obs.unobserve(e.target);
                  }
                });
              }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
              function observe() {
                document.querySelectorAll(
                  '.fade-up:not(.visible),.fade-in:not(.visible),.slide-left:not(.visible),.slide-right:not(.visible)'
                ).forEach(function(el) { obs.observe(el); });
              }
              observe();
              new MutationObserver(observe).observe(document.body, { childList: true, subtree: true });
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initObserver);
            } else {
              initObserver();
            }

          })();
        `}} />
      </body>
    </html>
  )
}
