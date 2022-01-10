export function getRegionForCoordinates(points: any) {
  // points should be an array of { latitude: X, longitude: Y }
  let minX: any, maxX: any, minY: any, maxY: any;

  // init first point
  ((point) => {
    minX = Number(point.latitude) || 0;
    maxX = Number(point.latitude) || 0;
    minY = Number(point.longitude) || 0;
    maxY = Number(point.longitude) || 0;
  })(points[0]);

  // calculate rect
  points.map((point: any) => {
    minX = Math.min(minX, Number(point.latitude) || 0);
    maxX = Math.max(maxX, Number(point.latitude) || 0);
    minY = Math.min(minY, Number(point.longitude) || 0);
    maxY = Math.max(maxY, Number(point.longitude) || 0);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = maxX - minX + 0.02;
  const deltaY = maxY - minY + 0.02;

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY,
  };
}

export function getRegionForCoordinate(point: any) {
  const { latitude, longitude, accuracy = 0 } = point;
  const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
  const circumference = (40075 / 360) * 1000;

  const latDelta = accuracy * (1 / (Math.cos(latitude) * circumference));
  const lonDelta = accuracy / oneDegreeOfLongitudeInMeters;

  return {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: Math.max(0, latDelta),
    longitudeDelta: Math.max(0, lonDelta),
  };
}
