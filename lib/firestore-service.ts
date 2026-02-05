import { db } from './firebase';
import { collection, doc, setDoc, getDoc, serverTimestamp, increment } from 'firebase/firestore';

export type ResponseType = 'YES' | 'NO';

export const saveProposalResponse = async (response: ResponseType, details?: any) => {
    try {
        const docId = response === 'YES' ? 'isYes' : 'isNo';
        const docRef = doc(db, 'responses', docId);

        const updateData: any = {
            response,
            timestamp: serverTimestamp(),
            ...details,
        };

        if (response === 'NO') {
            updateData.count = increment(1);
        }

        await setDoc(docRef, updateData, { merge: true });

        console.log('Document written with ID: ', docId);
        return docId;
    } catch (e) {
        console.error('Error adding document: ', e);
        return null;
    }
};

export const getProposalStatus = async () => {
    try {
        const docRef = doc(db, 'responses', 'isYes');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.response === 'YES';
        }
        return false;
    } catch (e) {
        console.error('Error getting document: ', e);
        return false;
    }
};
