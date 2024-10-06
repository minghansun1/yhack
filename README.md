## Inspiration
This summer, I wanted to see the Perseid meteor shower, so I hiked up a mountain with some friends. When I got to the top, however, the entire sky was covered in clouds (even though the forecast said there was a 50% chance for clouds), and we didn't see anything. Our team thought that it would be really convenient if we had an app to give real-time information about whether an area is suitable for stargazing.
## What It Does

**SkyGazer** provides an interactive map that identifies the best locations for stargazing based on three key environmental factors:
1. **Light Pollution**: Shows how dark the sky is at different locations.
2. **Visibility**: Displays real-time visibility data to ensure users have a clear view of the sky.
3. **Cloud Cover**: Provides information about current and forecasted cloud cover, helping users plan their stargazing trips.

Users can drop a pin anywhere on the map to get real-time data about the conditions at that location. Based on these factors, **SkyGazer** calculates a **composite score** that ranks each spot’s stargazing quality, from "Horrible" to "Pristine."

## How We Built It

- **Frontend**: The frontend is built using **React** and **React Router**, with an interactive map powered by **Google Maps API**. Users can drag a marker to any location, triggering a request to get real-time stargazing data.
  
- **Backend**: The backend is powered by **Flask**, which handles API requests. It fetches data from external APIs like **OpenWeatherMap** for visibility and cloud cover, as well as custom light pollution data to calculate the best spots for stargazing.

- **APIs**: We integrated multiple APIs, including:
  - **Google Maps API** for the interactive map and geolocation services.
  - **OpenWeatherMap API** for weather data, including visibility and cloud cover.
  - **Custom Light Pollution Data** for accurate assessments of sky brightness.

- **Styling**: We used **CSS** for styling, creating a clean, user-friendly interface for seamless navigation.

## Challenges We Ran Into

- **API Integration**: Combining data from multiple APIs and aligning them spatially and temporally was tricky. We faced challenges in making sure data was accurate and updated in real-time.
  
- **Calculating Composite Scores**: Developing an algorithm to provide a reliable stargazing score based on light pollution, visibility, and cloud cover involved tweaking and testing different weightings to ensure the accuracy of the scores.

- **UI/UX Design**: Designing a layout that presents complex data in an easy-to-understand and visually appealing manner required multiple iterations.

## Accomplishments That We're Proud Of

- Successfully integrating multiple APIs to create an informative and interactive experience.
- Building a real-time map that provides valuable insights to stargazers in a user-friendly manner.
- Developing a composite stargazing score that makes it easy for users to find the best places for stargazing at any given moment.

## What We Learned

- **API Management**: We gained a lot of experience managing and working with external APIs, understanding the intricacies of handling real-time data.
  
- **Map Integration**: We deepened our knowledge of integrating Google Maps into web applications and enhancing interactivity for users.

- **User Experience**: Through feedback and testing, we learned how to present complex data in a simplified way that can be understood by a wide range of users, from amateur stargazers to astronomy enthusiasts.

## What's Next for SkyGazer

- **Expanded Location Data**: Integrate data from more sources, including satellite data and ground-level observations, to improve the accuracy of stargazing locations.
  
- **Mobile App**: Develop a mobile app version of SkyGazer, making it easier for users to plan stargazing trips while on the go.

- **Social Features**: Allow users to save, rate, and share their favorite stargazing spots, building a community of stargazers who can contribute real-time insights and experiences.

- **AR Features**: Incorporate augmented reality (AR) features that help users identify constellations, planets, and celestial events through their device's camera while stargazing.
