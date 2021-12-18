import { BeeDatabase } from "../database.js";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  limit,
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
      where("password", "==", password),
      limit(1)
    ).withConverter(userConverter);
    const data = await getDocs(queryAuth);
    const userList = data.docs.map((doc)=>doc.data());
    // data.forEach((d) => {
    //   model_list.push(this.convertToModel(d));
    // });
    return userList;
  }

  static async getUser(userID) {
    let data = await getDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, userID).withConverter(userConverter)
    );
    return data.data();
  }

  static async getAllUserByRole(role)
  {
      const queryGetAllUserByRole = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("role", "==", role)).withConverter(userConverter);
      let datas = await getDocs(queryGetAllUserByRole)
      let userList = datas.docs.map((d) => {
        return d.data()
      })
      return userList
  }

}


class Student extends User{
  constructor(userID, studentID, email, password, name, major, role)
  {
    super(userID, email, password, name, role)
    this.studentID = studentID
    this.major = major
  }
}

class Lecturer extends User{
  constructor(userID, lecturerID, email, password, name, role)
  {
    super(userID, email, password, name, role)
    this.lecturerID = lecturerID
  }
}

class AdministrativeDepartment extends User{
  constructor(userID, email, password, name, role)
  {
    super(userID, email, password, name, role)
  }
}
class AcademicDepartment extends User{
  constructor(userID, email, password, name, role)
  {
    super(userID, email, password, name, role)
  }
}
class ScoringDepartment extends User{
  constructor(userID, email, password, name, role)
  {
    super(userID, email, password, name, role)
  }
}

var UserFactory = function () {
  this.createUser = function (userID, studentID, lecturerID, major, email, password, name, role) {
    var user
    if(role === 'student')
    {
      user = new Student(userID, studentID, email, password, name, major, role)
    }
    else if(role === 'lecturer')
    {
      user = new Lecturer(userID, lecturerID, email, password, name, role)
    }
    else if(role === 'administrative department')
    {
      user = new AcademicDepartment(userID, email, password, name, role)
    }
    else if(role === 'academic department')
    {
      user = new AcademicDepartment(userID, email, password, name, role)
    }
    else if(role === 'scoring department')
    {
      user = new ScoringDepartment(userID, email, password, name, role)
    }

    return user
  }
}


const userConverter = {
  toFirestore: (user) => {
    if(user.role == 'student')
    {
      return {
        userID: user.userID, 
        email: user.email, 
        password: user.password, 
        name: user.name, 
        role: user.role,
        studentID: user.studentID
      };
    }
    else if(user.role == 'lecturer')
    {
      return {
        userID: user.userID, 
        email: user.email, 
        password: user.password, 
        name: user.name, 
        role: user.role,
        lecturerID: user.lecturerID
      };
    }
    else
    {
      return {
        userID: user.userID, 
        email: user.email, 
        password: user.password, 
        name: user.name, 
        role: user.role, 
      };
    }
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    return new UserFactory().createUser(snapshot.id, d.studentID, d.lecturerID, d.major, d.email, d.password, d.name, d.role)
      // if(d.role == 'student')
      // {
      //   return new Student(snapshot.id, d.studentID, d.email, d.password, d.name, d.major, d.role)
      // }
      // else if(d.role == 'lecturer')
      // {
      //   return new Lecturer(snapshot.id, d.lecturerID, d.email, d.password, d.name, d.role)
      // }
      // else
      // {
      //   return new User(snapshot.id, d.email, d.password, d.name, d.role)
      // }
  }
};
