import rasterio
import os
file_path = 'map.tif'

with rasterio.open(file_path) as src:
    # Get the size of the file in bytes
    file_size = os.path.getsize(file_path)
    
    # Get additional information
    width = src.width
    height = src.height
    count = src.count  # Number of bands
    band_data = src.read(1)

def geo_to_pixel(longitude, latitude, min_lon = -180, max_lon = 180, min_lat=-65, max_lat=75, width=width, height=height):
    # Calculate pixel X
    pixel_x = (longitude - min_lon) / (max_lon - min_lon) * width

    # Calculate pixel Y
    pixel_y = (1 - (latitude - min_lat) / (max_lat - min_lat)) * height

    return int(pixel_x), int(pixel_y)

# Example geographic coordinates time square
latitude = 40.76
longitude = -73.98

# Get pixel coordinates
pixel_coordinates = geo_to_pixel(longitude, latitude)
#return the map value at the pixel coordinates

pixel_value = band_data[pixel_coordinates[1], pixel_coordinates[0]]
