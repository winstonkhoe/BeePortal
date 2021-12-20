import { BeeDatabase } from "../database.js";

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  getFirestore,
  setDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

export class Notif {
  static _CollectionName = "Notifications";

  constructor(notificationID, forumID, userID, classID, title, content) {
    this.notificationID = notificationID;
    this.forumID = forumID;
    this.userID = userID;
    this.classID = classID;
    this.title = title;
    this.content = content;
  }

  static async checkNotif(userID) {
    const queryGetNotif = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("userID", "==", userID),
      where("isPop", "==", false)
    ).withConverter(notifConverter);
    let datas = await getDocs(queryGetNotif);
    let notifList = datas.docs.map((d) => {
        console.log(d)
        console.log(d.data())
      return d.data();
    });

    return notifList;
  }

  static async setNotifOpened(notificationID) {
    await updateDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, notificationID),
      {
        isPop: true,
      }
    );
  }
}

const notifConverter = {
  toFirestore: (notif) => {
    return {
      notificationID: notif.notificationID,
      forumID: notif.forumID,
      userID: notif.userID,
      classID: notif.classID,
      title: notif.title,
      content: notif.content,
    };
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    return new Notif(
      snapshot.id,
      d.forumID,
      d.userID,
      d.classID,
      d.title,
      d.content
    );
  },
};
