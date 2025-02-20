import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCSdwpmS3JJ62CY1VSXwlV8iXEVSsVlZvE",
    authDomain: "voucher-for-tracking.firebaseapp.com",
    projectId: "voucher-for-tracking",
    storageBucket: "voucher-for-tracking.firebasestorage.app",
    messagingSenderId: "404093434510",
    appId: "1:404093434510:web:524d212eeac2fc72f2e7df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };