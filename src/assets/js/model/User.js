import { BeeDatabase } from "../database.js";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

export class User {
  static _CollectionName = "Users";

  constructor(userID, email, password, name, role) {
    this.userID = userID;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
  }

  static convertToModel(data) {
    let modelData = data.data();
    return new User(
      data.id,
      modelData.email,
      modelData.password,
      modelData.name,
      modelData.role
    );
  }

  static async auth(email, password) {
    const queryAuth = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("email", "==", email),
      where("password", "==", password)
    );
    const data = await getDocs(queryAuth);
    let model_list = [];
    data.forEach((d) => {
      model_list.push(this.convertToModel(d));
    });
    return model_list;
  }

  static async getUser(userID) {
    let data = await getDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, userID)
    );
    return this.convertToModel(data);
  }
}
