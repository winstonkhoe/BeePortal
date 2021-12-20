import { BeeDatabase } from "../database.js";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
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
import { Assignment } from "./Assignment.js";
import { Group } from "./Group.js";
import { Exam } from "./Exam.js";

export class Score {
  static _CollectionName = "Scores";

  constructor(scoreID, classID, taskID, userID, score, finalize, type, isCheating) {
    this.scoreID = scoreID;
    this.classID = classID;
    this.taskID = taskID;
    this.userID = userID;
    this.score = score;
    this.finalize = finalize;
    this.type = type;
    this.isCheating = isCheating;
  }

  static async getTaskType(taskID) {
    let task = await Assignment.getAssignment(taskID);
    if (task) return "assignment";
    else return "exam";
  }

  async insertScore() {
    try {
      const docIns = await addDoc(
        collection(BeeDatabase.getDatabase(), "Scores"),
        {
          classID: this.classID,
          taskID: this.taskID,
          userID: this.userID,
          score: Number(this.score),
          finalize: this.finalize,
          type: this.type,
          isUpdated: false,
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  static async setExistingScoreIsUpdated(taskID, userID) {
    let list = await this.getScoreDocument(taskID, userID, false)

    if (list.length > 0) {
      await updateDoc(
        doc(BeeDatabase.getDatabase(), this._CollectionName, list[0].scoreID),
        {
          isUpdated: true,
        }
      );
    }
  }

  static async getScoreDocument(taskID, userID, isUpdatedBool) {
    let queryGetExistingScoreDoc = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("taskID", "==", taskID),
      where("userID", "==", userID),
      where("isUpdated", "==", isUpdatedBool),
      limit(1)
    ).withConverter(scoreConverter);
    let list = []
    let data = await getDocs(queryGetExistingScoreDoc);
    list = data.docs.map((d) => {
      return d.data();
    });
    return list
  }

  static async finalizeScore(taskID, userID) {
    let list = this.getScoreDocument(taskID, userID, false)

    if (list.length > 0) {
      await updateDoc(
        doc(BeeDatabase.getDatabase(), this._CollectionName, list[0].scoreID),
        {
          finalize: true
        }
      );
    }
  }

  static async checkReported(taskID, userID) {
    let list = await this.getScoreDocument(taskID, userID, false)

    console.log(list)
    if(!list || list.length <= 0)
    {
      return false
    }
    return list[0].isCheating === true
  }

  static async reportCheating(taskID, userID) {
    let list = await this.getScoreDocument(taskID, userID, false)
    let exam = await Exam.getExam(taskID)
    let docID = ''

    if (list.length <= 0) {
      try {
        const docIns = await addDoc(
          collection(BeeDatabase.getDatabase(), this._CollectionName),
          {
            classID: exam.classID,
            taskID: taskID,
            userID: userID,
            score: 0,
            finalize: false,
            type: 'exam',
            isUpdated: false,
          }
        );
        docID = docIns.id
      } catch (error) {
      }
    }
    if (list.length > 0) docID = list[0].scoreID

    await updateDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, docID),
      {
        isCheating: true
      }
    );
  }

  static async getScore(scoreID) {
    let data = await getDoc(
      doc(
        BeeDatabase.getDatabase(),
        this._CollectionName,
        scoreID
      ).withConverter(scoreConverter)
    );
    return data.data();
  }

  static async getAllClassIndividualAssignments(classID) {
    const queryGetAllClassIndividualAssignments = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("classID", "==", classID),
      where("group", "==", false)
    ).withConverter(scoreConverter);
    let datas = await getDocs(queryGetAllClassIndividualAssignments);
    let assignments = datas.docs.map((d) => {
      return d.data();
    });
    return assignments;
  }
}

const scoreConverter = {
  toFirestore: (score) => {
    return {
      classID: score.classID,
      taskID: score.taskID,
      userID: score.userID,
      score: score.score,
      finalize: score.finalize,
      type: score.type,
    };
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    let task = Score.getTaskType(d.taskID);
    return new Score(
      snapshot.id,
      d.classID,
      d.taskID,
      d.userID,
      d.score,
      d.finalize,
      task,
      d.isCheating
    );
  },
};
