import firebase from "firebase/app";
import auth from "firebase/auth";
import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";
export const Sum = (a: number, b: number) => a + b;

let app: firebase.app.App | null = null;

export function initialize(...props: Parameters<typeof firebase.initializeApp>) {
    app = firebase.initializeApp(...props);

}

type Nullable<T> = {
    [P in keyof T]: T[P] | null
}

type Providers = {
    auth: firebase.auth.Auth,
    firestore: firebase.firestore.Firestore,
    functions: firebase.functions.Functions
}
let providers: Nullable<Providers> = {
    auth: null,
    firestore: null,
    functions: null
}


export function initializeProvider(p: Providers) {
    providers = p;

    for (const key in providers) {
        if (key === null) {
            console.warn(`${key} was not initialized, this can cause problems`);
        }
    }

}
function assertProviders(providers: any): asserts providers is Required<Providers> {

}
export function loginWithProvider(email: string, password: string) {
    assertProviders(providers);

    return providers.auth.signInWithEmailAndPassword(email, password);
}
export function logoutWithProvider() {
    assertProviders(providers);

    return providers.auth.signOut();
}

export async function getDocWithProvider(docPath: string) {
    assertProviders(providers);

    const db = providers.firestore;
    const ref = db.doc(docPath);

    const data = await ref.get();

    return {
        data: data.data(),
        onChange: ref.onSnapshot,
    }

}

function assertAppExists(app: any): asserts app is firebase.app.App {
    if (!app) {
        throw new Error("Firebase app not initialized");
    }
}
export async function createUser(email: string, password: string) {
    assertAppExists(app);

    return await app.auth().createUserWithEmailAndPassword(email, password);
}
export async function loginWithEmail(email: string, password: string) {
    assertAppExists(app);


    return await app.auth().createUserWithEmailAndPassword(email, password);
}

export async function logout() {
    assertAppExists(app);

    return app.auth().signOut();
}

export async function getData(docPath: string) {
    assertAppExists(app);
    const db = app.firestore();
    const ref = db.doc(docPath);

    const data = await ref.get();

    return {
        data: data.data(),
        onChange: ref.onSnapshot,
    }
}

export async function functionCall(functionName: string, body: object) {
    assertAppExists(app);


    const call = app.functions().httpsCallable(functionName);
    return (await call.call(body)).data;
}



