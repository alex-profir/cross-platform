import type firebase from "firebase"

export const Sum = (a: number, b: number) => a + b;
export const product = (a: number, b: number) => a * b;
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
        onChange: ref.onSnapshot.bind(ref),
    }

}

export async function functionCallWithProvider(functionName: string, body?: any) {
    assertProviders(providers);

    const functions = providers.functions;

    const call = functions.httpsCallable(functionName);
    return (await call.call(body)).data;
}

