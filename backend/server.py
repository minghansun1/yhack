from flask import Flask, request
import requests
from flask import jsonify
import light_pollution as lp
from dotenv import load_dotenv
import os
app = Flask(__name__)
# pip install python-dotenv

load_dotenv(dotenv_path='secrets.env')

#make the route a get request with latitude and longitude as parameters
@app.route('/light')
def light():
    latitude = float(request.args.get('latitude'))
    longitude = float(request.args.get('longitude'))
    print('latitude:', latitude, 'longitude:', longitude)
    pixel_coordinates = lp.geo_to_pixel(longitude, latitude)
    pixel_value = lp.band_data[pixel_coordinates[1], pixel_coordinates[0]]
    return str(pixel_value)

WEATHER_API_KEY = os.environ['WEATHER_API_KEY'] # Replace with your OpenWeatherMap API key

@app.route('/weather', methods=['GET'])
def get_weather():
    latitude = float(request.args.get('latitude'))
    longitude = float(request.args.get('longitude'))

    url = f'https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={WEATHER_API_KEY}&units=metric'
    
    # Make the request to the OpenWeatherMap API
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        weather_data = response.json()
        return jsonify(weather_data)  # Return the JSON response
    else:
        return jsonify({'error': 'Unable to fetch weather data'}), response.status_code




if __name__ == '__main__':
    app.run()
