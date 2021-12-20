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
  query,
  where,
  updateDoc,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
import { Class } from "./Class.js";
import { User } from "./User.js";

export class Forum {
  static _CollectionName = "Forums";

  
  constructor(forumID, classID, title, content, date, userID, privacy) {
    this.forumID = forumID
    this.classID = classID
    this.title = title
    this.content = content
    this.date = date
    this.userID = userID
    this.privacy = privacy
  }

  
  
  async insertForum() {
    try {
    const docIns = await addDoc(
    collection(BeeDatabase.getDatabase(), "Forums"),
    {
      classID: this.classID,
      title: this.title,
      content: this.content,
      date: serverTimestamp(),
      userID: this.userID,
      privacy: this.privacy,
    })
    return {
      forumID: docIns.id,
      title: this.title,
      classID: this.classID,
      content: this.content,
      userID: this.userID
    }

    } catch (error) {
      console.log(error)
    return false
    }
  }

  static async updateForum(forumID, content) {
    try {
      await updateDoc(
        doc(BeeDatabase.getDatabase(), this._CollectionName, forumID),
        {
          content: content,
        }
      );
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  static async removeForum(forumID) {
    try {
      await deleteDoc(
        doc(BeeDatabase.getDatabase(), this._CollectionName, forumID),
      );
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  static async getForum(forumID) {
    let data = await getDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, forumID).withConverter(forumConverter)
    );
    return data.data()
  }

  static async getAllClassForum(classID) {
    console.log(classID)
    const queryGetAllClassForum = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("classID", "==", classID)
    ).withConverter(forumConverter);
    let datas = await getDocs(queryGetAllClassForum);
    let forums = datas.docs.map((d) => {
      return d.data();
    });
    return forums;
  }

  static async getAllForumOfUser(userID) {
    let u = await User.getUser(userID);
    let classes;
    console.log(u.role)
    if (u.role == "student") {
      classes = await Class.getAllStudentClass(userID);
    } else if (u.role == "lecturer") {
      classes = await Class.getAllLecturerClass(userID);
    }
    let forums = await Promise.all(
      classes.map(async (c) => {
        return await this.getAllClassForum(c.classID);
      })
    );
    return forums.flat();
  }

  static convertToModel(data) {
    let modelData = data.data();
    return new Forum(
      data.id,
      modelData.classID,
      modelData.title,
      modelData.content,
      modelData.date,
      modelData.userID,
      modelData.privacy
    );
  }
}

const forumConverter = {
  toFirestore: (forum) => {
    return {
        classID: forum.classID,
        title: forum.title,
        content: forum.content,
        date: serverTimestamp(),
        userID: forum.userID,
        privacy: forum.privacy,
    };
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    let f = new Forum(
        snapshot.id,
        d.classID,
        d.title,
        d.content,
        d.date,
        d.userID,
        d.privacy
      );
    return f
  },
};
