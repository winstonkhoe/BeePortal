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
import { Class } from "./Class.js";
import { User } from "./User.js";

export class Exam {
  static _CollectionName = "Exams";

  constructor(examID, classID, start, end, proctorID, type) {
    this.examID = examID;
    this.classID = classID;
    this.start = start;
    this.end = end;
    this.proctorID = proctorID;
    this.type = type;
  }

  async insertExam() {
    try {
      await addDoc(collection(BeeDatabase.getDatabase(), "Exams"), {
        classID: this.classID,
        start: new Timestamp(new Date(this.start).getTime() / 1000, 0),
        end: new Timestamp(new Date(this.end).getTime() / 1000, 0),
        type: this.type,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateSchedule() {}

  async removeSchedule() {}

  static async getExam(examID) {
    const data = await getDoc(
      doc(
        BeeDatabase.getDatabase(),
        this._CollectionName,
        examID
      ).withConverter(examConverter)
    );
    return data.data();
  }

  static async getAllExam() {
    let data = await getDocs(
      collection(BeeDatabase.getDatabase(), this._CollectionName).withConverter(
        examConverter
      )
    );
    let examList = data.docs.map((d) => {
      console.log(d.data());
      return d.data();
    });

    examList.sort(function (a, b) {
      return a.start - b.start;
    });

    return examList;
  }

  static async getAllExamOfStudent(userID) {
    let classList = await Class.getAllStudentClass(userID);
    let examList = [];
    classList.map(async (c) => {
      const queryGetAllExamOfUser = query(
        collection(BeeDatabase.getDatabase(), this._CollectionName),
        where("classID", "==", c.classID)
      ).withConverter(examConverter);
      let datas = await getDocs(queryGetAllExamOfUser);
      let exams = datas.docs.map((d) => {
        return d.data();
      });
      examList.push(exams);
      examList.flat();
    });
    examList.sort(function (a, b) {
      return a.start - b.start;
    });

    return examList;
  }

  static async getAllExamOfProctor(userID) {
    const queryGetAllExamOfProctor = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("proctorID", "==", userID)
    ).withConverter(examConverter);
    let datas = await getDocs(queryGetAllExamOfProctor);
    let examList = datas.docs.map((d) => {
      return d.data();
    });
    examList.flat();
    examList.sort(function (a, b) {
      return a.start - b.start;
    });

    return examList;
  }

  static async assignProctor(examID, proctorID) {
    await updateDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, examID),
      {
        proctorID: proctorID,
      }
    );
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
          return course;
        }
      })
    );
    return uniqueCourseList;
  }
}

const examConverter = {
  toFirestore: (exam) => {
    return {};
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    return new Exam(
      snapshot.id,
      d.classID,
      d.start,
      d.end,
      d.proctorID,
      d.type
    );
  },
};
