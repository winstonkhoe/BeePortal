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
import { User } from "./User.js";

export class Class {
  static _CollectionName = "Classes";

  constructor(
    classID,
    courseID,
    classCode,
    studentID,
    lecturerID,
    day,
    scheduleID
  ) {
    this.classID = classID;
    this.courseID = courseID;
    this.classCode = classCode;
    this.studentID = studentID;
    this.lecturerID = lecturerID;
    this.day = day;
    this.scheduleID = scheduleID;
    this.observers = []
    this.subscribeObserver(studentID);
    this.subscribeObserver(lecturerID);
  }

  subscribeObserver(observer) {
      observer.map((o)=>{
          this.observers.push(o.id);
      })
    this.observers = this.observers.flat();
  }

  async notifyObserver(forumID, title, content, userID) {
    await Promise.all(this.observers.map(async (o) => {
      if (o !== userID) {
        await addDoc(collection(BeeDatabase.getDatabase(), "Notifications"), {
          forumID: forumID,
          classID: this.classID,
          title: title,
          content: content,
          userID: o,
          isPop: false
        });
      }
    }));
  }

  async insertClass() {
    try {
      let d = await Promise.all(
        addDoc(collection(BeeDatabase.getDatabase(), "Classes"), {
          courseID: doc(BeeDatabase.getDatabase(), "Courses", this.courseID),
          classCode: this.classCode,
          schedule: {
            day: this.day,
            scheduleID: doc(
              BeeDatabase.getDatabase(),
              "Schedules",
              this.scheduleID
            ),
          },
        })
      );
      return d.id;
    } catch (error) {
      return false;
    }
  }

  static async updateClass(classID, lecturerID, studentID) {
    try {
      await Promise.all(
        lecturerID.map(async (id) => {
          console.log("lecturer: " + id);
          await updateDoc(
            doc(BeeDatabase.getDatabase(), this._CollectionName, classID),
            {
              lecturerID: arrayUnion(
                doc(BeeDatabase.getDatabase(), "Users", id)
              ),
            }
          );
        })
      );

      await Promise.all(
        studentID.map(async (id) => {
          console.log("students: " + id);
          await updateDoc(
            doc(BeeDatabase.getDatabase(), this._CollectionName, classID),
            {
              studentID: arrayUnion(
                doc(BeeDatabase.getDatabase(), "Users", id)
              ),
            }
          );
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getClass(classID) {
    // console.log(classID)
    let data = await getDoc(
      doc(
        BeeDatabase.getDatabase(),
        this._CollectionName,
        classID
      ).withConverter(classConverter)
    );

    return data.data();
  }

  static async getAllClass() {
    let data = await getDocs(
      collection(BeeDatabase.getDatabase(), this._CollectionName).withConverter(
        classConverter
      )
    );
    let classList = data.docs.map((d) => {
      return d.data();
    });

    return classList;
  }

  static async getAllStudentListByClass(classID) {
    // console.log(classID)
    let c = await this.getClass(classID);
    let userList = [];
    if (c.studentID) {
      userList = await Promise.all(
        c.studentID.map(async (studentRef) => {
          return await User.getUser(studentRef.id);
        })
      );
    }

    return userList;
  }

  static async getAllLecturerListByClass(classID) {
    let c = await this.getClass(classID);
    let lecturerList = [];
    if (c.lecturerID) {
      lecturerList = await Promise.all(
        c.lecturerID.map(async (lecturerRef) => {
          return await User.getUser(lecturerRef.id);
        })
      );
    }

    return lecturerList;
  }

  static async getAllStudentClass(studentID) {
    const queryGetAllStudentClass = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where(
        "studentID",
        "array-contains",
        doc(BeeDatabase.getDatabase(), "Users", studentID)
      )
    ).withConverter(classConverter);
    let datas = await getDocs(queryGetAllStudentClass);
    let classList = datas.docs.map((d) => {
      return d.data();
    });

    return classList;
  }

  static async getAllLecturerClass(lecturerID) {
    const queryGetAllLecturerClass = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where(
        "lecturerID",
        "array-contains",
        doc(BeeDatabase.getDatabase(), "Users", lecturerID)
      )
    ).withConverter(classConverter);
    let datas = await getDocs(queryGetAllLecturerClass);
    let classList = datas.docs.map((d) => {
      return d.data();
    });

    return classList;
  }

  static async getAllCourseClasses(courseID) {
    const queryGetAllCourseClasses = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where(
        "courseID",
        "==",
        doc(BeeDatabase.getDatabase(), "Courses", courseID)
      )
    ).withConverter(classConverter);
    let datas = await getDocs(queryGetAllCourseClasses);
    let classList = datas.docs.map((d) => {
      return d.data();
    });

    return classList;
  }
}

const classConverter = {
  toFirestore: (c) => {
    return {
      courseID: doc(BeeDatabase.getDatabase(), "Courses", c.courseID),
      classCode: c.classCode,
      studentID: c.studentID,
      lecturerID: c.lecturerID,
      schedule: {
        day: c.day,
        scheduleID: c.scheduleID,
      },
    };
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    let s = d.schedule;

    return new Class(
      snapshot.id,
      d.courseID,
      d.classCode,
      d.studentID,
      d.lecturerID,
      s.day,
      s.scheduleID
    );
  },
};
