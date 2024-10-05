from flask import Flask, request
import light_pollution as lp
app = Flask(__name__)

#make the route a get request with latitude and longitude as parameters
@app.route('/light')
def light():
    latitude = float(request.args.get('latitude'))
    longitude = float(request.args.get('longitude'))
    print('latitude:', latitude, 'longitude:', longitude)
    pixel_coordinates = lp.geo_to_pixel(longitude, latitude)
    pixel_value = lp.band_data[pixel_coordinates[1], pixel_coordinates[0]]
    return str(pixel_value)

if __name__ == '__main__':
    app.run()
