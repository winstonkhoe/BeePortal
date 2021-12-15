import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, setDoc, query, where, updateDoc, arrayUnion, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { User } from "./User.js";

export class Class {
    static _CollectionName = "Classes"
    constructor(classID, courseID, classCode, studentID, lecturerID, day, scheduleID)
    {
       this.classID = classID
       this.courseID = courseID
       this.classCode = classCode
       this.studentID = studentID
       this.lecturerID = lecturerID
       this.day = day
       this.scheduleID = scheduleID
    //    this.day = day
    }

    async insertClass()
    {
        try {
            let d = await addDoc(collection(BeeDatabase.getDatabase(), "Classes"), {
                courseID: doc(BeeDatabase.getDatabase(), "Courses", this.courseID), 
                classCode: this.classCode, 
                schedule: {
                    day: this.day,
                    scheduleID: this.scheduleID
                }
            });
            return d.id
        } catch (error) {
            return false
        }
    }
    
    static async updateClass(classID, lecturerID, studentID)
    {
        try {
            lecturerID.map( async (id) => {
                await updateDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, classID), {
                    lecturerID: arrayUnion(doc(BeeDatabase.getDatabase(), "Users", id))
                });
            })
            
            studentID.map( async (id) => {
                await updateDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, classID), {
                    studentID: arrayUnion(doc(BeeDatabase.getDatabase(), "Users", id))
                });
            })
            return true
        } catch (error) {
            return false
        }
    }

    async removeForum()
    {

    }

    static async getClass(classID)
    {
        let data = await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, classID).withConverter(classConverter))
        
        return data.data()
    }

    static async getAllClass()
    {
        let data = await getDocs((collection(BeeDatabase.getDatabase(), this._CollectionName)).withConverter(classConverter))
        let classList = data.docs.map((d) => {
            return d.data()
        })

        return classList
    }

    static async getAllStudentListByClass(classID)
    {
        let c = await this.getClass(classID)
        let userList = await Promise.all (c.studentID.map( async (studentRef) => {
            return await User.getUser(studentRef.id)
        }))

        return userList
    }

    static async getAllLecturerListByClass(classID)
    {
        let c = await this.getClass(classID)
        let lecturerList = await Promise.all(c.lecturerID.map( async (lecturerRef) => {
            return await User.getUser(lecturerRef.id)
        }))

        return lecturerList
    }

    static async getAllStudentClass(studentID)
    {
        const queryGetAllStudentClass = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("studentID", "array-contains", doc(BeeDatabase.getDatabase(), "Users", studentID)));
        let datas = await getDocs(queryGetAllStudentClass)
        let classList = datas.docs.map((d) => {
            return d.data()
        })

        return classList
    }

    static async getAllLecturerClass(lecturerID)
    {
        const queryGetAllLecturerClass = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("lecturerID", "==", doc(BeeDatabase.getDatabase(), "Users", lecturerID)));
        let datas = await getDocs(queryGetAllLecturerClass)
        let classList = datas.docs.map((d) => {
            return d.data()
        })

        return classList
    }

    static async getAllCourseClasses(courseID)
    {
        const queryGetAllCourseClasses = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("courseID", "==", doc(BeeDatabase.getDatabase(), "Courses", courseID)));
        let datas = await getDocs(queryGetAllCourseClasses)
        let classList = datas.docs.map((d) => {
            return d.data()
        })

        return classList
    }

    static convertToModel(data)
    {
        let modelData = data.data()
        console.log(modelData)
        return new Class(data.id, modelData.courseID, modelData.classCode, modelData.studentID, modelData.lecturerID)
    }
}

const classConverter = {
    toFirestore: (c) => {
        // console.log(doc(BeeDatabase.getDatabase(), "Courses", c.courseID))
        return {
            courseID: doc(BeeDatabase.getDatabase(), "Courses", c.courseID), 
            classCode: c.classCode, 
            studentID: c.studentID, 
            lecturerID: c.lecturerID,
            schedule: {
                day: c.day,
                scheduleID: c.scheduleID
            }
        };
    },
    fromFirestore: (snapshot, options) => {
        let d = snapshot.data(options);
        let s = d.schedule 
        return new Class(snapshot.id, d.courseID, d.classCode, d.studentID, d.lecturerID, s.day, s.scheduleID);
    }
};