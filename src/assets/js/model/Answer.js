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

export class Answer {
  static _CollectionName = "Answers";

  constructor(answerID, assignmentID, userID, answer, submissionDate) {
    this.answerID = answerID;
    this.assignmentID = assignmentID;
    this.userID = userID;
    this.answer = answer;
    this.submissionDate = submissionDate;
  }

  async insertAnswer() {
    try {
      if(this.groupID)
      {
        const docIns = await addDoc(
          collection(BeeDatabase.getDatabase(), "Answers"),
          {
            assignmentID: this.assignmentID,
            userID: this.userID,
            groupID: this.groupID,
            answer: this.answer,
            submissionDate: serverTimestamp(),
            isUpdated: false
          }
          );
      }
      else
      {
        const docIns = await addDoc(
        collection(BeeDatabase.getDatabase(), "Answers"),
        {
          assignmentID: this.assignmentID,
          userID: this.userID,
          answer: this.answer,
          submissionDate: serverTimestamp(),
          isUpdated: false
        }
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getStudentGroupOfAssignment(assignmentID, userID)
  {
    let asg = await Assignment.getAssignment(assignmentID);
    let userGroupID
    let groupArr = []
    groupArr = await Promise.all(asg.groups.map(async (g) => {
      return await Group.getGroup(g.id);
    }));
    console.log(groupArr)
    groupArr.map((g)=>{
      g.userID.map((userObj) => {
        if(userObj.userID == userID)
        {
          userGroupID = g.groupID
        }
      })
    })
    return userGroupID
  }

  static async setExistingAnswerIsUpdated(assignmentID, userID) {
    let asg = await Assignment.getAssignment(assignmentID);
    let queryGetExistingAnswer;
    let userGroupID
    if (asg.group === true) {
      //Group Assignment
      userGroupID = await this.getStudentGroupOfAssignment(assignmentID, userID)

      queryGetExistingAnswer = query(
        collection(BeeDatabase.getDatabase(), "Answers"),
        where("assignmentID", "==", assignmentID),
        where("groupID", "==", userGroupID),
        where('isUpdated', '==', false),
        // limit(1)
      ).withConverter(answerConverter);
    } // Individual Assignment
    else {
      queryGetExistingAnswer = query(
        collection(BeeDatabase.getDatabase(), "Answers"),
        where("assignmentID", "==", assignmentID),
        where("userID", "==", userID),
        where('isUpdated', '==', false),
        // limit(1)
      ).withConverter(answerConverter);
    }

    const data = await getDocs(queryGetExistingAnswer);
    let answers = [];
    answers = data.docs.map((doc) => doc.data());
    console.log(answers)
    await Promise.all(answers.map(async (a) => {
      console.log(a)
      await updateDoc(
        doc(BeeDatabase.getDatabase(), this._CollectionName, a.answerID),
        {
          isUpdated: true,
        }
      );
    }));
    return userGroupID
  }

  static async getStudentAnswerOfIndividualAssignment(assignmentID, userID) {
    let queryGetStudentAnswer = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("assignmentID", "==", assignmentID),
      where("userID", "==", userID),
      where('isUpdated', '==', false),
      limit(1)
    ).withConverter(answerConverter);
    const data = await getDocs(queryGetStudentAnswer);
    let answer = data.docs.map((d) => {return d.data()})
    console.log(answer)
    return answer.length > 0 ? answer[0] : null
  }

  static async getAnswer(answerID) {
    let data = await getDoc(
      doc(
        BeeDatabase.getDatabase(),
        this._CollectionName,
        answerID
      ).withConverter(answerConverter)
    );
    return data.data();
  }

  // static async getAllClassIndividualAssignments(classID) {
  //   const queryGetAllClassIndividualAssignments = query(
  //     collection(BeeDatabase.getDatabase(), this._CollectionName),
  //     where("classID", "==", classID),
  //     where("group", "==", false)
  //   ).withConverter(answerConverter);
  //   let datas = await getDocs(queryGetAllClassIndividualAssignments);
  //   let assignments = datas.docs.map((d) => {
  //     return d.data();
  //   });
  //   return assignments;
  // }

  // static async getAllClassGroupAssignments(classID) {
  //   const queryGetAllClassGroupAssignments = query(
  //     collection(BeeDatabase.getDatabase(), this._CollectionName),
  //     where("classID", "==", classID),
  //     where("group", "==", true)
  //   ).withConverter(answerConverter);
  //   let datas = await getDocs(queryGetAllClassGroupAssignments);
  //   let assignments = datas.docs.map((d) => {
  //     return d.data();
  //   });
  //   return assignments;
  // }

}

export class GroupAnswer extends Answer {
  constructor(answerID, assignmentID, userID, groupID, answer, submissionDate) {
    super(answerID, assignmentID, userID, answer, submissionDate);
    this.groupID = groupID;
  }
}


const answerConverter = {
  toFirestore: (answer) => {
    if (answer.groupID) {
      return {
        assignmentID: answer.assignmentID,
        userID: answer.userID,
        groupID: answer.groupID,
        answer: answer.answer,
        submissionDate: serverTimestamp(),
      };
    } else {
      return {
        assignmentID: answer.assignmentID,
        userID: answer.userID,
        answer: answer.answer,
        submissionDate: serverTimestamp(),
      };
    }
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    if (d.groupID) {
      return new GroupAnswer(
        snapshot.id,
        d.assignmentID,
        d.userID,
        d.groupID,
        d.answer,
        d.submissionDate
      );
    } else {
      return new Answer(
        snapshot.id,
        d.assignmentID,
        d.userID,
        d.answer,
        d.submissionDate
      );
    }
  },
};