import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const createUser = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'users'), data)
        return docRef;
    } catch(err) {
        console.error("Error adding document: ", e)
    }
}