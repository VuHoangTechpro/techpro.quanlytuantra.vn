class GoogleMapService{

  static createMarker(pos, urlIcon){
    let icon = GoogleMapService.createIcon(urlIcon);
    let marker = new google.maps.Marker({
      position: pos,
      // animation: google.maps.Animation.BOUNCE,
      icon: icon
    });
    return marker;
  }
  
  static createInfoWindow(content, maxWidth = 300, maxHeight = 300){
    let infoWindow = new google.maps.InfoWindow({
      content:content,
      maxWidth: maxWidth,
      maxHeight: maxHeight
    });
    return infoWindow
  }
  
  static createIcon(url, scaledSize = 17){
    let icon = {
      url: url, // url
      scaledSize: new google.maps.Size(scaledSize, scaledSize), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    return icon;
  }
  
  static createPolyline(path, strokeColor = 'red', strokeOpacity = 0.8, strokeWeight = 4){
    let polyline = new google.maps.Polyline({
      path: path,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight
    });
    return polyline;
  }
  
  static createPolygon(path, strokeColor = "green", strokeOpacity = 0.8, strokeWeight = 2, fillColor = "green", fillOpacity = 0.4){
    let polygon = new google.maps.Polygon({
      path: path,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight,
      fillColor: fillColor,
      fillOpacity: fillOpacity
    });
    return polygon;
  }
  
  static createMapProp(zoom, lat, lng){
    let mapProp = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
    };
    return mapProp;
  }

  static calDistanceOfRoute(points){
    let sumOfDistance = 0;
    points.forEach((point, index) => {
      if(index != points.length - 1){
        const { dCheckPointLat, dCheckPointLong } = point;
        let lat1 = Number(dCheckPointLat);
        let lon1 = Number(dCheckPointLong);
        const lat2 = Number(points[index + 1].dCheckPointLat);
        const lon2 = Number(points[index + 1].dCheckPointLong);
        let R = 6371; // km
        let φ1 = GoogleMapService.toRadian(lat1);
        let φ2 = GoogleMapService.toRadian(lat2);
        let Δφ = GoogleMapService.toRadian(lat2-lat1);
        let Δλ = GoogleMapService.toRadian(lon2-lon1);
  
        let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
              let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
              let d = R * c;
        sumOfDistance += d;
      }
    })
    return sumOfDistance;
  }
  
  static toRadian(degree) {
    return degree * Math.PI/180;
  }
  
}