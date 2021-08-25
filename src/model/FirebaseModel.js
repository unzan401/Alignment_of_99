// Firebase App (the core Firebase SDK) is always required and must be listed first
// 這個等於當初第一個 script 標籤
import firebase from "firebase/app";


// 後面都是 import 第一個後才能接著 import 的各模塊
// 這個等於當初第二個 script 標籤

// Add the Firebase products that you want to use
// 這兩個剛好是我們後面需要的模塊 !! 一個是身分驗證，一個是 cloud firestore 雲端資料庫
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIHirmV1sv79CgVkSNeXZZOu1nfQ6fgtI",
    authDomain: "alignment99-bef9a.firebaseapp.com",
    databaseURL: "https://alignment99-bef9a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "alignment99-bef9a",
    storageBucket: "alignment99-bef9a.appspot.com",
    messagingSenderId: "338869000934",
    appId: "1:338869000934:web:b20c83d09625dd9ed5b927",
    measurementId: "G-TP8Y0HYEPX"
    };
    // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}