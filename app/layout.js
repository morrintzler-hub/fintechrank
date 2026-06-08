import './globals.css'
import HamburgerMenu from '../components/HamburgerMenu'
import { headers } from 'next/headers'

export const metadata = {
  metadataBase: new URL('https://www.thefintechrank.com'),
  verification: {
    google: 'Lk5FsVy1yXc_kyNMrwCl3Rgf7uIvxevkktmEqMjmFlA',
  },
  title: {
    default: "The Fintech Rank — Compare the World's Top 100 Fintech Companies",
    template: '%s | The Fintech Rank',
  },
  description: "Unbiased ratings, verified pricing, and side-by-side comparisons across the world's top 100 fintech companies.",
  keywords: ['fintech','fintech comparison','best fintech apps','payment processing','neobank','crypto exchange'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.thefintechrank.com',
    siteName: 'The Fintech Rank',
    title: "The Fintech Rank — Compare the World's Top 100 Fintech Companies",
    description: "Unbiased ratings, verified pricing, and side-by-side feature comparisons.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.thefintechrank.com' },
}

export default function RootLayout({ children }) {
  // Read theme from middleware cookie for server-side rendering
  const headersList = headers()
  const theme = headersList.get('x-theme') || 'light'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>

        {/* Intro animation - homepage only */}
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

        {/* Subtle background */}
        <div className="bg-base" aria-hidden="true"></div>

        {/* Nav */}
        <nav className="nav" id="mainNav">
          <a href="/" className="nav-logo">
            <span className="nav-dot"></span>
            The Fintech <span className="nav-acc">Rank</span>
          </a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/compare">Compare</a>
            <div className="nav-dropdown">
              <a href="/category/payments" className="nav-dropdown-trigger">Categories ▾</a>
              <div className="nav-dropdown-menu">
                <a href="/category/payments">Payments</a>
                <a href="/category/banking">Banking</a>
                <a href="/category/investing">Investing</a>
                <a href="/category/crypto">Crypto</a>
                <a href="/category/lending">Lending</a>
                <a href="/category/business">Business</a>
              </div>
            </div>
            <a href="/blog">Blog</a>
            <a href="/methodology">Methodology</a>
            <a href="/about">About</a>
          </div>
          <a href="mailto:hello@thefintechrank.com" className="nav-cta">
            Submit a Company
          </a>
          <HamburgerMenu />
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
            <a href="/methodology">Methodology</a>
            <a href="/about">About</a>
            <a href="/compare">Compare tool</a>
            <a href="/blog">Blog</a>
            <a href="/about">Methodology</a>
            <a href="mailto:hello@thefintechrank.com">Contact</a>
          </div>
        </footer>
        <div className="footer-bottom">
          2026 The Fintech Rank · Independent research ·
          Affiliate disclosure: some links may earn us a commission at no extra cost to you.
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // Nav scroll effect
            var nav = document.getElementById('mainNav');
            if (nav) {
              window.addEventListener('scroll', function() {
                nav.classList.toggle('nav-scrolled', window.scrollY > 20);
              }, { passive: true });
            }

            // Intro - homepage only, once per session
            var isHome = window.location.pathname === '/';
            var intro = document.getElementById('fr-intro');
            if (intro && isHome && !sessionStorage.getItem('tfr_intro_v4')) {
              sessionStorage.setItem('tfr_intro_v4', '1');
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
              setTimeout(dismiss, 3800);
            }

            // Scroll animations
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
            new MutationObserver(observe).observe(document.body, {childList:true, subtree:true});
          })();
        `}} />
      </body>
    </html>
  )
}
