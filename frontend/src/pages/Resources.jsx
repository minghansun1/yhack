import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import '../styles/Resources.css'; // Import the CSS file

const Resources = () => (
  <div className="resources-container">
    <section className="resources-hero">
      <h1>Stargazing Resources</h1>
      <p className="intro-text">
        Explore a variety of tools, tips, and resources to enhance your stargazing experience. Whether you're a beginner or a seasoned astronomer, you'll find valuable information to guide you.
      </p>
      <Link to="/" className="cta-button">Go back to the map</Link>
    </section>

    <section className="resources-content">
      <h2>Stargazing Tools</h2>
      <ul>
        <li><strong>Telescopes:</strong> Explore telescopes for different levels, from beginner to advanced. <a href="https://www.skyatnightmagazine.com/buying-guides/best-telescopes/" target="_blank" rel="noreferrer">Best Telescopes of 2024</a></li>
        <li><strong>Binoculars:</strong> A great, portable tool for stargazing. <a href="https://www.space.com/14223-best-astronomy-binoculars.html" target="_blank" rel="noreferrer">Top Astronomy Binoculars</a></li>
        <li><strong>Star Charts:</strong> Maps that help you locate stars and constellations. <a href="https://www.skyandtelescope.com/interactive-sky-chart/" target="_blank" rel="noreferrer">Interactive Sky Chart</a></li>
      </ul>

      <h2>Best Practices for Stargazing</h2>
      <ul>
        <li><strong>Pick a Dark Location:</strong> Find areas away from city lights for the best view. National parks often have designated stargazing spots.</li>
        <li><strong>Check the Weather:</strong> Make sure you pick a night with clear skies. <a href="https://www.accuweather.com/en/us/skywatching" target="_blank" rel="noreferrer">Skywatching Weather</a></li>
        <li><strong>Give Your Eyes Time:</strong> Your eyes need 20-30 minutes to adjust to darkness for optimal stargazing.</li>
      </ul>

      <h2>Recommended Stargazing Apps</h2>
      <ul>
        <li><strong>Star Walk 2:</strong> An interactive app that helps you identify stars, planets, and constellations. <a href="https://starwalk.space/" target="_blank" rel="noreferrer">Star Walk 2</a></li>
        <li><strong>SkySafari:</strong> A comprehensive app for finding planets, stars, and galaxies. <a href="https://skysafariastronomy.com/" target="_blank" rel="noreferrer">SkySafari</a></li>
        <li><strong>Stellarium:</strong> A planetarium app for your phone that helps you explore the sky. <a href="https://stellarium-web.org/" target="_blank" rel="noreferrer">Stellarium</a></li>
      </ul>

      <h2>Useful Websites</h2>
      <ul>
        <li><strong>Sky & Telescope:</strong> A leading resource for stargazing news and tools. <a href="https://skyandtelescope.org/" target="_blank" rel="noreferrer">Sky & Telescope</a></li>
        <li><strong>International Dark-Sky Association:</strong> Find certified dark sky parks and reserves around the world. <a href="https://www.darksky.org/" target="_blank" rel="noreferrer">IDA</a></li>
        <li><strong>Heavens-Above:</strong> Track satellites, the ISS, and other celestial objects. <a href="https://heavens-above.com/" target="_blank" rel="noreferrer">Heavens-Above</a></li>
      </ul>

      <h2>Recommended Stargazing Books</h2>
      <ul>
        <li><strong>NightWatch: A Practical Guide to Viewing the Universe</strong> by Terence Dickinson – A beginner's guide to astronomy.</li>
        <li><strong>Turn Left at Orion</strong> by Guy Consolmagno – A detailed guide for telescope users.</li>
        <li><strong>Astronomy for Dummies</strong> by Stephen P. Maran – An easy-to-follow introduction to stargazing.</li>
      </ul>
    </section>

    <footer className="resources-footer">
      <p>Stargazing App &copy; 2024</p>
    </footer>
  </div>
);

export default Resources;
