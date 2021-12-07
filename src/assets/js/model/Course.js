import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Class } from "./Class.js";
import { User } from "./User.js";

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

    static async getUniqueCourses(userID)
    {
        let user = await User.getUser(userID)
        let classList
        if(user.role == 'student')
            classList = await Class.getAllStudentClass(userID)
        else if(user.role == 'lecturer')
            classList = await Class.getAllLecturerClass(userID)

        let uniqueCourseList = []
        uniqueCourseList = await Promise.all (classList.map(async c => {
            let course = await this.getCourse(c.courseID.id)
            if(uniqueCourseList.indexOf(course) === -1) {
                return course
            }
        }))
        return uniqueCourseList
    }

    static convertToModel(data)
    {
        let modelData = data.data()
        return new Course(data.id, modelData.name, modelData.syllabusID, modelData.credits)
    }
}