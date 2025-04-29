  // OpenStreetMap ka free tile URL
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Map ko initialize karo
  const map = L.map('map').setView([26.449923, 80.33187], 9);

  // Tile layer add karo
  L.tileLayer(tileUrl, {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // User location detect karna
  map.locate({ setView: true, maxZoom: 16 });

  // Location milne par marker lagana
  map.on('locationfound', function(e) {
    L.marker(e.latlng).addTo(map)
      .bindPopup('You are here! 📍')
      .openPopup();
  });

  // Location error handle karna
  map.on('locationerror', function(e) {
    console.log("User ne location access deny kiya.");
    alert("Location permission deni padegi location dekhne ke liye.");
  });

  const marker = new mapbox.Marker()
  .setLngLat([])
  .addTo(map);