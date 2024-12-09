import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';

const JOBS_COLLECTION = 'jobs';

export const addJob = async (jobData) => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, jobData);
    return jobId;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const getJob = async (jobId) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }
    throw new Error('Job not found');
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

export const getEmployerJobs = async (employerId, status = null) => {
  try {
    let jobsQuery = query(
      collection(db, JOBS_COLLECTION),
      where('employerId', '==', employerId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      jobsQuery = query(
        collection(db, JOBS_COLLECTION),
        where('employerId', '==', employerId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(jobsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting employer jobs:', error);
    throw error;
  }
};
