namespace TriLink.Services
{
    public static class PolyLineDecoder
    {
        /// <summary>
        /// Decodes a Google Maps encoded polyline string into a list of (latitude, longitude) coordinates.
        /// </summary>
        public static List<(double lat, double lon)> Decode(string encodedPolyline)
        {
            if (string.IsNullOrEmpty(encodedPolyline))
                return new List<(double, double)>();

            var poly = new List<(double lat, double lon)>();
            int index = 0, len = encodedPolyline.Length;
            int lat = 0, lng = 0;

            while (index < len)
            {
                int b, shift = 0, result = 0;
                do
                {
                    b = encodedPolyline[index++] - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
                lat += dlat;

                shift = 0;
                result = 0;
                do
                {
                    b = encodedPolyline[index++] - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
                lng += dlng;

                poly.Add((lat / 1E5, lng / 1E5));
            }

            return poly;
        }
    }
}
