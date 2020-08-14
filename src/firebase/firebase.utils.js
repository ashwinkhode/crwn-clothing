import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyCSY2y1pP0Su4HtH4HWJmQwWh8R2HmTYxc",
    authDomain: "crwn-db-17498.firebaseapp.com",
    databaseURL: "https://crwn-db-17498.firebaseio.com",
    projectId: "crwn-db-17498",
    storageBucket: "crwn-db-17498.appspot.com",
    messagingSenderId: "223662331630",
    appId: "1:223662331630:web:028f32c9d8cfb85859c5ff",
    measurementId: "G-JW29093YYP"
};

export const createUserProfileDocument = async ( userAuth ) => {
    if (!userAuth) {
        return;
    } 

    const userRef = firestore.doc(`users/${userAuth.uid}`)

    const snapShot = await userRef.get();

    if(!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt
            })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    return userRef;

}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
