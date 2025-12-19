namespace TriLink.Services
{
    public static class PolyLineEncoder
    {
        /// <summary>
        /// Encodes a list of (latitude, longitude) coordinates into a Google Maps encoded polyline string.
        /// </summary>
        public static string Encode(List<(double lat, double lon)> points)
        {
            if (points == null || points.Count == 0)
                return string.Empty;

            var str = new System.Text.StringBuilder();
            var encodeDiff = (Action<int>)(diff =>
            {
                int shifted = diff << 1;
                if (diff < 0)
                    shifted = ~shifted;
                int rem = shifted;
                while (rem >= 0x20)
                {
                    str.Append((char)((0x20 | (rem & 0x1f)) + 63));
                    rem >>= 5;
                }
                str.Append((char)(rem + 63));
            });

            int lastLat = 0, lastLng = 0;
            foreach (var point in points)
            {
                int lat = (int)Math.Round(point.lat * 1E5);
                int lng = (int)Math.Round(point.lon * 1E5);
                encodeDiff(lat - lastLat);
                encodeDiff(lng - lastLng);
                lastLat = lat;
                lastLng = lng;
            }

            return str.ToString();
        }
    }
}
