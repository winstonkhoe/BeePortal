import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'

export class Course {
    static _CollectionName = "Courses"

    constructor(courseID, name, syllabusID, credits)
    {
       this.courseID = courseID
       this.name = name
       this.syllabusID = syllabusID
       this.credits = credits
    }

    async insertCourse()
    {
        try {
            await addDoc(collection(BeeDatabase.getDatabase(), this._CollectionName), {
                courseID: this.courseID, 
                name: this.name, 
                syllabusID: this.syllabusID, 
                credits: this.credits
            });
            return true
        } catch (error) {
            return false
        }
    }
    
    async updateCourse()
    {

    }

    async removeCourse()
    {

    }

    static async getCourse(courseID)
    {
        const data = await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, courseID))
        return this.convertToModel(data)
    }

    static async getAllCourses()
    {
        const queryGetAllCourses = query(collection(BeeDatabase.getDatabase(), this._CollectionName));
        let datas = await getDocs(queryGetAllCourses)
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

    static convertToModel(data)
    {
        let modelData = data.data()
        return new Course(data.id, modelData.name, modelData.syllabusID, modelData.credits)
    }
}