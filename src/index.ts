import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

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
export function createUser(email: string, password: string) {
    assertAppExists(app);

    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
}
export function loginWithEmail(email: string, password: string) {
    assertAppExists(app);

    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
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