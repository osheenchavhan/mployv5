const { admin } = require('../config/firebase');
const db = admin.firestore();

class BaseModel {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  // Create a new document
  async create(data) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { id: docRef.id, ...data };
  }

  // Get a document by ID
  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update a document
  async update(id, data) {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return this.findById(id);
  }

  // Delete a document
  async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }

  // Query documents
  async query(conditions = [], limit = 10) {
    let query = this.collection;
    
    conditions.forEach(condition => {
      query = query.where(condition.field, condition.operator, condition.value);
    });

    const snapshot = await query.limit(limit).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Geospatial query
  async geoQuery(location, radius, limit = 10) {
    const center = new admin.firestore.GeoPoint(location.latitude, location.longitude);
    const bounds = this.getGeoBounds(center, radius);

    const snapshot = await this.collection
      .where('location', '>=', bounds.lower)
      .where('location', '<=', bounds.upper)
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Helper method to calculate geo bounds
  getGeoBounds(center, radiusInKm) {
    const lat = center.latitude;
    const lon = center.longitude;
    const latRadian = lat * (Math.PI / 180);
    
    // Earth's radius in kilometers
    const earthRadius = 6371;
    
    // Angular distance in radians
    const radDist = radiusInKm / earthRadius;
    
    const minLat = lat - radDist * 180 / Math.PI;
    const maxLat = lat + radDist * 180 / Math.PI;
    
    const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(latRadian));
    const minLon = lon - deltaLon * 180 / Math.PI;
    const maxLon = lon + deltaLon * 180 / Math.PI;
    
    return {
      lower: new admin.firestore.GeoPoint(minLat, minLon),
      upper: new admin.firestore.GeoPoint(maxLat, maxLon)
    };
  }
}

module.exports = BaseModel;
