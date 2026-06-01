import './globals.css'

export const metadata = {
  title: 'FintechRank — Compare the World\'s Top 100 Fintech Companies',
  description: 'Unbiased ratings, feature breakdowns, and side-by-side comparisons across Payments, Banking, Investing, Crypto, Lending, and Business fintech.',
  openGraph: {
    title: 'FintechRank',
    description: 'Compare the world\'s top 100 fintech companies',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Nav />
        <main className="page-enter">
          {children}
        </main>
        <FooterComponent />
        <ScrollAnimator />
      </body>
    </html>
  )
}

function Nav() {
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">
        <span className="nav-dot"></span>
        Fintech<span className="nav-acc">Rank</span>
      </a>
      <div className="nav-links">
        <a href="/">Compare</a>
        <a href="/category/payments">Categories</a>
        <a href="/#reviews">Reviews</a>
      </div>
      <a href="mailto:hello@fintechrank.com" className="nav-cta">Submit a Company</a>
    </nav>
  )
}

function FooterComponent() {
  return (
    <>
      <footer>
        <div>
          <div className="footer-brand">Fintech<span>Rank</span></div>
          <div className="footer-tagline">Independent research on the world's top 100 fintech companies. Updated by our community in real time.</div>
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
          <a href="#">Methodology</a>
          <a href="#">Advertise</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
      <div className="footer-bottom">
        © 2025 FintechRank · Independent research · Affiliate disclosure: some links may earn us a commission at no extra cost to you.
      </div>
    </>
  )
}

// Injects the IntersectionObserver that drives all scroll animations
function ScrollAnimator() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      (function() {
        function init() {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate score bars when they come into view
                entry.target.querySelectorAll && entry.target.querySelectorAll('.score-bar-fill').forEach(bar => {
                  bar.classList.add('animate');
                });
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

          document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right').forEach(el => {
            observer.observe(el);
          });

          // Re-run when new content loads (for dynamic pages)
          const mutationObserver = new MutationObserver(() => {
            document.querySelectorAll('.fade-up:not(.visible), .fade-in:not(.visible), .slide-left:not(.visible), .slide-right:not(.visible)').forEach(el => {
              observer.observe(el);
            });
          });
          mutationObserver.observe(document.body, { childList: true, subtree: true });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init);
        } else {
          init();
        }
      })();
    `}} />
  )
}
