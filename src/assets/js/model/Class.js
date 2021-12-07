import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'

export class Class {
    static _CollectionName = "Classes"

    constructor(classID, courseID, classCode, studentID, lecturerID, classSchedule, examSchedule)
    {
       this.classID = classID
       this.courseID = courseID
       this.classCode = classCode
       this.studentID = studentID
       this.lecturerID = lecturerID
       this.classSchedule = classSchedule
       this.examSchedule = examSchedule
    }

    async insertForum()
    {
        try {
            await addDoc(collection(BeeDatabase.getDatabase(), this._CollectionName), {
                classID: this.classID,
                forumTitle: this.title,
                content: this.content,
                date: Timestamp.now(),
                userID: this.userID,
                privacy: this.privacy
            });
            return true
        } catch (error) {
            return false
        }
    }
    
    async updateForum()
    {

    }

    async removeForum()
    {

    }

    static async getClass(classID)
    {
        return await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, classID))
    }

    static async getAllStudentClass(studentID)
    {
        const queryGetAllStudentClass = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("studentID", "array-contains", doc(BeeDatabase.getDatabase(), "Users", studentID)));
        let datas = await getDocs(queryGetAllStudentClass)
        let modelList = []
        datas.forEach((d) => {
            modelList.push(this.convertToModel(d))
        })
        
        return modelList
    }

    static async getAllLecturerClass(lecturerID)
    {
        const queryGetAllLecturerClass = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("lecturerID", "==", doc(BeeDatabase.getDatabase(), "Users", lecturerID)));
        let datas = await getDocs(queryGetAllLecturerClass)
        let modelList = []
        datas.forEach((d) => {
            modelList.push(this.convertToModel(d))
        })
        return modelList
    }

    static async getAllCourseClasses(courseID)
    {
        const queryGetAllCourseClasses = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("courseID", "==", doc(BeeDatabase.getDatabase(), "Courses", courseID)));
        let datas = await getDocs(queryGetAllCourseClasses)
        let modelList = []
        datas.forEach((d) => {
            modelList.push(this.convertToModel(d))
        })
        return modelList
    }

    static convertToModel(data)
    {
        let modelData = data.data()
        return new Class(data.id, modelData.courseID, modelData.classCode, modelData.studentID, modelData.lecturerID, modelData.classSchedule, modelData.examSchedule)
    }
}