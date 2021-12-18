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

export class Assignment {
  static _CollectionName = "Assignments";

  constructor(assignmentID, classID, title, content, submissionDate, group) {
    this.assignmentID = assignmentID;
    this.classID = classID;
    this.title = title;
    this.content = content;
    this.submissionDate = submissionDate;
    this.group = group;
  }

  async insertAssignment() {
    try {
      const docIns = await addDoc(
        collection(BeeDatabase.getDatabase(), "Assignments"),
        {
          classID: this.classID,
          title: this.title,
          content: this.content,
          submissionDate: new Timestamp(new Date(this.submissionDate).getTime()/1000),
          group: this.group,
        }
      );
      return docIns.id;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async assignStudentGroup(assignmentID, groupNumber, userID) {
    let docIns;
    docIns = await addDoc(collection(BeeDatabase.getDatabase(), "Groups"), {
      group: groupNumber,
    });
    await Promise.all(
      userID.map(async (id) => {
        await updateDoc(doc(BeeDatabase.getDatabase(), "Groups", docIns.id), {
          userID: arrayUnion(doc(BeeDatabase.getDatabase(), "Users", id)),
        });
      })
    );
    await updateDoc(
      doc(BeeDatabase.getDatabase(), this._CollectionName, assignmentID),
      {
        groups: arrayUnion(doc(BeeDatabase.getDatabase(), "Groups", docIns.id)),
      }
    );
  }

  async updateAssignment() {}

  async removeForum() {}

  static async getAssignment(assignmentID) {
    let data = await getDoc(
      doc(
        BeeDatabase.getDatabase(),
        this._CollectionName,
        assignmentID
      ).withConverter(assignmentConverter)
    );
    return data.data() !== undefined ? data.data() : null;
  }

  static async getAllClassAssignmentSorted(classID, sortingType) {
    const queryGetAllClassIndividualAssignments = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("classID", "==", classID),
      orderBy('submissionDate', sortingType)
      ).withConverter(assignmentConverter);
    let datas = await getDocs(queryGetAllClassIndividualAssignments);
    let assignments = datas.docs.map((d) => {
      return d.data();
    });
    return assignments;
  }

  static async getAllClassIndividualAssignments(classID) {
    const queryGetAllClassIndividualAssignments = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("classID", "==", classID),
      where("group", "==", false)
    ).withConverter(assignmentConverter);
    let datas = await getDocs(queryGetAllClassIndividualAssignments);
    let assignments = datas.docs.map((d) => {
      return d.data();
    });
    return assignments;
  }

  static async getAllClassGroupAssignments(classID) {
    const queryGetAllClassGroupAssignments = query(
      collection(BeeDatabase.getDatabase(), this._CollectionName),
      where("classID", "==", classID),
      where("group", "==", true)
    ).withConverter(assignmentConverter);
    let datas = await getDocs(queryGetAllClassGroupAssignments);
    let assignments = datas.docs.map((d) => {
      return d.data();
    });
    return assignments;
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

const assignmentConverter = {
  toFirestore: (assignment) => {
    if (assignment.group === true) {
      return {
        assignmentID: assignment.assignmentID,
        classID: assignment.classID,
        title: assignment.title,
        content: assignment.content,
        submissionDate: assignment.submissionDate,
        group: assignment.group,
        groups: assignment.groups,
      };
    } else {
      return {
        assignmentID: assignment.assignmentID,
        classID: assignment.classID,
        title: assignment.title,
        content: assignment.content,
        submissionDate: assignment.submissionDate,
        group: assignment.group,
      };
    }
  },
  fromFirestore: (snapshot, options) => {
    let d = snapshot.data(options);
    if (d.group === true) {
      return new GroupAssignment(
        snapshot.id,
        d.classID,
        d.title,
        d.content,
        d.submissionDate,
        d.group,
        d.groups
      );
    } else {
      return new Assignment(
        snapshot.id,
        d.classID,
        d.title,
        d.content,
        d.submissionDate,
        d.group
      );
    }
  },
};

class GroupAssignment extends Assignment {
  constructor(
    assignmentID,
    classID,
    title,
    content,
    submissionDate,
    group,
    groups
  ) {
    super(assignmentID, classID, title, content, submissionDate, group);
    this.groups = groups;
  }
}
