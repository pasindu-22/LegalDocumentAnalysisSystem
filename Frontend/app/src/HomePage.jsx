import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";

const HomePage = ({ showNavbar = true }) => {
  const [activePage, setActivePage] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we need to redirect
  useEffect(() => {
    // If we're at the root URL, set active page to home
    if (location.pathname === "/") {
      setActivePage("home");
    }
  }, [location]);

  // Navigation handler with transition
  const navigateTo = (path) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setIsTransitioning(false);
    }, 500); // Match this to the CSS transition duration
  };

  // Component for Home content
  const HomeContent = () => (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Legal Document Intelligence Platform</h1>
          <p>
            Streamline your legal document workflow with our advanced AI-powered
            analysis and extraction system.
          </p>
          <div className="cta-buttons">
            <button
              className="primary-button"
              onClick={() => navigateTo("/login")}
            >
              Get Started
            </button>
            {/* <button className="secondary-button">Schedule Demo</button> */}
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn.prod.website-files.com/65c4ab17d1f4702114123723/66249c83f971285a2372422e_Website%20Audit%20Creatives%20-%202023-02-01T092833.750.png"
            alt="Legal document analysis visualization"
          />
        </div>
      </section>

      <section className="features">
        <h2>Legal Document Solutions</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Contract Analysis</h3>
            <p>
              Automatically identify key clauses, obligations, rights, and
              potential risks in contracts and legal agreements.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Legal Analytics</h3>
            <p>
              Generate comprehensive analytics on document trends, clause
              frequency, and risk assessment across your legal portfolio.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Compliance</h3>
            <p>
              Ensure document compliance with regulatory requirements and
              company policies through automated verification.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>Trusted by Legal Professionals</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              "This platform has transformed how our firm handles contract
              reviews, reducing analysis time by over 60% while improving
              accuracy."
            </p>
            <div className="testimonial-author">
              - Sarah Chen, Managing Partner, Chen & Associates
            </div>
          </div>
          <div className="testimonial-card">
            <p>
              "The clause extraction and risk assessment features have become
              indispensable tools for our corporate legal department."
            </p>
            <div className="testimonial-author">
              - Robert Johnson, General Counsel, Enterprise Corp
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Elevate your legal document workflows today</h2>
        <button className="primary-button" onClick={() => navigateTo("/login")}>
          Start Now
        </button>
      </section>
    </>
  );

  // Component for Upload content
  const UploadContent = () => (
    <section className="page-content">
      <h1>Upload Document</h1>
      <div className="upload-container">
        <div className="upload-box">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drag and drop your legal documents here</p>
          <p>or</p>
          <button className="primary-button">Browse Files</button>
          <p className="file-info">Supports PDF, DOCX, JPG, PNG formats</p>
        </div>
        <div className="upload-instructions">
          <h3>How it works:</h3>
          <ol>
            <li>Upload your legal documents</li>
            <li>Our AI will analyze the content</li>
            <li>Review the extracted insights and analysis</li>
            <li>Download reports or integrate with your workflow</li>
          </ol>
        </div>
      </div>
    </section>
  );

  // Component for Dashboard content
  const DashboardContent = () => (
    <section className="page-content">
      <h1>Dashboard</h1>
      <div className="dashboard-preview">
        <p>Sign in to view your document analysis dashboard</p>
        <button className="primary-button">Sign In</button>
        <div className="dashboard-demo">
          <h3>Dashboard Preview</h3>
          <div className="demo-image">
            <img src="/images/dashboard-preview.png" alt="Dashboard preview" />
          </div>
        </div>
      </div>
    </section>
  );

  // Component for About content
  const AboutContent = () => (
    <section className="page-content">
      {/* <h1>About LegalDocs AI</h1> */}
      <div className="about-container">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At LegalDocs AI, we're committed to transforming the legal document
            analysis process through cutting-edge artificial intelligence. Our
            mission is to empower legal professionals with tools that increase
            efficiency, reduce errors, and provide deeper insights into complex
            legal documents.
          </p>
        </div>
        <div className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team consists of legal experts, AI specialists, and software
            engineers dedicated to creating the most powerful and user-friendly
            legal document analysis platform available.
          </p>
        </div>
      </div>
    </section>
  );

  // Render the active page content
  const renderPageContent = () => {
    switch (activePage) {
      case "home":
        return <HomeContent />;
      case "upload":
        return <UploadContent />;
      case "dashboard":
        return <DashboardContent />;
      case "about":
        return <AboutContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className={`homepage ${isTransitioning ? "page-exit" : ""}`}>
      {/* {showNavbar && (
        <header className="header">
          <div className="logo">
            <h1>LegalDocs AI</h1>
          </div>
          <nav className="navigation">
            <ul>
              <li>
                <a
                  href="#"
                  className={activePage === "home" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activePage === "upload" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("upload");
                  }}
                >
                  Document Analysis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activePage === "dashboard" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("dashboard");
                  }}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={activePage === "about" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("about");
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <button className="login-button">Login</button>
              </li>
            </ul>
          </nav>
        </header>
      )} */}

      {renderPageContent()}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            {/* <h2>LegalDocs AI</h2> */}
            <p>Advanced Legal Document Intelligence</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Product</h3>
              <ul>
                <li>
                  <a href="/features">Features</a>
                </li>
                <li>
                  <a href="/pricing">Pricing</a>
                </li>
                <li>
                  <a href="/security">Security</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/careers">Careers</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/documentation">Documentation</a>
                </li>
                <li>
                  <a href="/support">Support</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 LegalAI. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
