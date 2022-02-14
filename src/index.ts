import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { DocumentSnapshot, FirestoreError, getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { logEvent, getAnalytics } from "firebase/analytics";
import { getFunctions, httpsCallable } from "firebase/functions";
export const Sum = (a: number, b: number) => a + b;

let app: FirebaseApp | null = null;
export function initialize(...props: Parameters<typeof initializeApp>) {
    app = initializeApp(...props);

}
function assertAppExists(app: any): asserts app is FirebaseApp {
    if (!app) {
        throw new Error("Firebase app not initialized");
    }
}
export async function createUser(email: string, password: string) {
    assertAppExists(app);

    const auth = getAuth();

    return await createUserWithEmailAndPassword(auth, email, password);;
}
export async function loginWithEmail(email: string, password: string) {
    assertAppExists(app);

    const auth = getAuth();

    return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
    assertAppExists(app);
    const auth = getAuth();
    signOut(auth);
}

export async function getData(docPath: string) {

    const firestore = getFirestore();

    const ref = doc(firestore, docPath);

    const data = await getDoc(ref);

    const onChange = (cb: {
        next?: (snapshot: DocumentSnapshot<any>) => void;
        error?: (error: FirestoreError) => void;
        complete?: () => void;
    }) => onSnapshot(ref, cb);

    return {
        data: data.data(),
        onChange,
    }
}

export async function functionCall(functionName: string, body: object) {
    assertAppExists(app);

    const functions = getFunctions(app);

    const call = httpsCallable<any, any>(functions, functionName);
    return (await call.call(functions, body)).data;
}


export async function loginWithGoogle() {
    assertAppExists(app);

    const auth = getAuth();
    const firestore = getFirestore();

    const googleAuthProvider = new GoogleAuthProvider();

    const data = await signInWithPopup(auth, googleAuthProvider);

    const firstName = data.user?.displayName?.split(" ")[0];
    const lastName = data.user?.displayName?.split(" ")[1];

    const cityRef = doc(firestore, 'users', data.user?.uid);
    await setDoc(cityRef, {
        firstName,
        lastName
    }, { merge: true });
    return data;
}



