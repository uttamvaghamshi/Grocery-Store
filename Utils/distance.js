import Store from '.././Models/StoreAdmin.js';


function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}


function calculateDistance(lat1, long1, lat2, long2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLong = toRadians(long2 - long1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; //Km
}

async function findNearestStore(userLat, userLong) {
  const stores = await Store.find();
  let nearestStore = null;
  let minDistance = Infinity;

  stores.forEach(store => {
    const dist = calculateDistance(userLat, userLong, store.location.lat, store.location.long);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStore = store;
    }  });

  return nearestStore; // Returns the nearest store object
}

export default findNearestStore;