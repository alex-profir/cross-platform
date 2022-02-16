import { initialize, loginWithEmail, getData } from ".";
import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyBWErgtU4ymTHSs-Ei2jlrykfJBuUto3cY",
    authDomain: "cross-platform-b9fdc.firebaseapp.com",
    projectId: "cross-platform-b9fdc",
    storageBucket: "cross-platform-b9fdc.appspot.com",
    messagingSenderId: "360442866391",
    appId: "1:360442866391:web:ffa18230301935f8369e92",
    measurementId: "G-GDG2EXYYZL"
};
initialize(firebaseConfig);
const sleep = (ms: number) => new Promise((res, rej) => setTimeout(res, ms))
async function tests() {
    await sleep(1000);
    console.log("DOC TEST -------")
    const { data, onChange } = await getData("test/gSFXb239behYxvRiuVqI");
    console.log(data);
    onChange(doc => {
        console.log(doc.data());
    })
    console.log("END DOC TEST -------")
    console.log("User test ---------------");
    const user = await loginWithEmail("alex_profir@yahoo.com", "12345678");
    console.log({ user });
    console.log("End User test ---------------");

}
try {
    tests();
    console.log("All went good");
} catch (e) {
    console.log("ERROR");
    console.log(e);
}