import { BeeDatabase } from "../database.js";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  getDoc,
  getFirestore,
  query,
  where,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
import { Class } from "./Class.js";
import { User } from "./User.js";

export class Course {
  static _CollectionName = "Courses";

  constructor(courseID, name, syllabusID, credits) {
    this.courseID = courseID;
    this.name = name;
    this.syllabusID = syllabusID;
    this.credits = credits;
    this.collectionName = "Courses"
  }

  async insertCourse() {
    try {
      await setDoc(doc(BeeDatabase.getDatabase(), this.collectionName, this.courseID),
        {
          name: this.name,
          syllabusID: this.syllabusID,
          credits: this.credits,
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateCourse() {}

  async removeCourse() {}

  static async getCourse(courseID) {
    const data = await getDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, courseID).withConverter(courseConverter)
    );
    return data.data()
  }

  static async getAllCourses() {
    const queryGetAllCourses = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName).withConverter(
        courseConverter
      )
    );
    let datas = await getDocs(queryGetAllCourses);
    let courseList = datas.docs.map((d) => {
      return d.data()
    });

    return courseList;
  }

  static async getAllLecturerClass(lecturerID) {
    const queryGetAllLecturerClass = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where(
        "lecturerID",
        "==",
        doc(BeeDatabase.getDatabase(), "Users", lecturerID)
      )
    );
    let datas = await getDocs(queryGetAllLecturerClass);
    let modelList = [];
    datas.forEach((d) => {
      modelList.push(this.convertToModel(d));
    });
    return modelList;
  }

  static async getUniqueCourses(userID) {
    let user = await User.getUser(userID);
    let classList;
    if (user.role == "student")
      classList = await Class.getAllStudentClass(userID);
    else if (user.role == "lecturer")
      classList = await Class.getAllLecturerClass(userID);

    let uniqueCourseList = [];
    uniqueCourseList = await Promise.all(
      classList.map(async (c) => {
        let course = await this.getCourse(c.courseID.id);
        if (uniqueCourseList.indexOf(course) === -1) {
          return course
        }
      })
    );
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    let unique = uniqueCourseList.filter(onlyUnique)
    // uniqueCourseList.map((c) => {
    //   if(unique.indexOf(c) < 0)
    //   {
    //     unique.push(c)
    //   }
    // })
      console.log(unique)

    return uniqueCourseList;
  }

  static convertToModel(data) {
    let modelData = data.data();
    return new Course(
      data.id,
      modelData.name,
      modelData.syllabusID,
      modelData.credits
    );
  }
}

const courseConverter = {
  toFirestore: (course) => {
    return {
      courseID: course.courseID,
      name: course.name,
      syllabusID: course.syllabusID,
      credits: course.credits,
    };
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    console.log(d)
    return new Course(snapshot.id, d.name, d.syllabusID, d.credits);
  },
};
