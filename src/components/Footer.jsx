import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-col">
            <h3>IMTv</h3>
            <p>
              This is a really cool movie library website made for a school
              project. This site does not store any movies in its database. Any
              complaints will be woefully ignored.
            </p>
          </div>
          <div className="footer-col">
            <h3>Quick links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Use</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Find us</h3>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2025 IMTv. All rights reserved.</div>
    </footer>
  );
}
