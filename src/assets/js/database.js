import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js'

export const BeeDatabase = (function(){
    function createDB()
    {
        const firebaseConfig = {
            apiKey: "AIzaSyCXUN9-zxPw5JK9_w0qcovzIrDJRSxyZlk",
            authDomain: "beeportal-6725b.firebaseapp.com",
            projectId: "beeportal-6725b",
            storageBucket: "beeportal-6725b.appspot.com",
            messagingSenderId: "1003254756737",
            appId: "1:1003254756737:web:a9f25aa01eeb2f9545a480",
            measurementId: "G-8PVF3W51SE"
          };

        return initializeApp(firebaseConfig)
    }
    var dbInstance
    return {
        getDatabase: function(){
            if(dbInstance == null) {
                dbInstance = createDB()
            }
            return getFirestore(dbInstance)
        },
    }
})()