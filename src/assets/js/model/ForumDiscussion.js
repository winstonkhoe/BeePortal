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
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
import { Class } from "./Class.js";
import { User } from "./User.js";

export class ForumDiscussion {
  static _CollectionName = "ForumDiscussions";

  constructor(forumDiscussionID, forumID, content, date, userID) {
    this.forumDiscussionID = forumDiscussionID
    this.forumID = forumID
    this.content = content
    this.date = date
    this.userID = userID
  }

  async insertForumDiscussion() {
    try {
        console.log(this)
        console.log(this.forumID)
        console.log(this.content)
        console.log(this.userID)
    const docIns = await addDoc(collection(BeeDatabase.getDatabase(), "ForumDiscussions"),
      {
        forumID: this.forumID,
        content: this.content,
        date: serverTimestamp(),
        userID: this.userID,
      })
    
    return true;
    } catch (error) {
        console.log(error)
    return false
    }
  }

  async updateForum() {}

  async removeForum() {}

  static async getForumDiscussion(forumDiscussionID) {
    let data = await getDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, forumDiscussionID).withConverter(forumDiscussionConverter)
    );
    return data.data()
  }

  static async getAllForumDiscussion(forumID) {
    const queryGetAllForumDiscussion = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("forumID", "==", forumID)
    ).withConverter(forumDiscussionConverter);
    let datas = await getDocs(queryGetAllForumDiscussion);
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

const forumDiscussionConverter = {
  toFirestore: (forum) => {
    return {
        forumID: forum.forumID,
        content: forum.content,
        date: serverTimestamp(),
        userID: forum.userID,
    };
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    return new ForumDiscussion(
        snapshot.id,
        d.forumID,
        d.content,
        d.date,
        d.userID,
      );
  },
};