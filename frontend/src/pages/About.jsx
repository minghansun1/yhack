import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import '../styles/About.css'; // Import the separate CSS file

const About = () => (
  <div className="about-container">
    <section className="about-hero">
      <div className="about-content">
        <h1>Welcome to Stargazing App</h1>
        <p className="intro-text">
          Our mission is to help you discover the best stargazing spots and evaluate environmental conditions such as light pollution, visibility, and cloud cover. Whether you're a casual observer or a seasoned astronomer, our app will guide you to the perfect viewing location.
        </p>
        <Link to="/" className="cta-button">Go back to the map</Link>
      </div>
    </section>

    <section className="about-features">
      <h2>Features</h2>
      <div className="features-grid">
        <div className="feature-item">
          <h3>Light Pollution Analysis</h3>
          <p>We use satellite data to provide an accurate assessment of light pollution levels, helping you find dark skies for optimal stargazing.</p>
        </div>
        <div className="feature-item">
          <h3>Visibility Insights</h3>
          <p>Our app checks real-time weather conditions to show you the visibility in any given location, ensuring clear skies for your observation.</p>
        </div>
        <div className="feature-item">
          <h3>Cloud Cover Forecast</h3>
          <p>We provide detailed cloud cover forecasts to help you avoid cloudy nights and ensure the clearest possible view of the stars.</p>
        </div>
      </div>
    </section>

    <section className="about-mission">
      <h2>Our Mission</h2>
      <p>
        We believe everyone should have the opportunity to experience the wonders of the night sky. Stargazing is more than just a hobby – it's a way to connect with the universe. Our mission is to make it easier for anyone, anywhere to discover and enjoy the stars.
      </p>
    </section>

    <footer className="about-footer">
      <p>Stargazing App &copy; 2024</p>
    </footer>
  </div>
);

export default About;
