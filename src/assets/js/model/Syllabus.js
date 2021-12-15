import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Class } from "./Class.js";
import { User } from "./User.js";

export class Syllabus {
    static _CollectionName = "Syllabuses"

    constructor(syllabusID, description, outcomes, strategies, textbooks)
    {
        this.syllabusID = syllabusID
       this.description = description
       this.outcomes = outcomes
       this.strategies = strategies
       this.textbooks = textbooks
    }

    async insertSyllabus()
    {
        try {
            await addDoc(collection(BeeDatabase.getDatabase(), this._CollectionName), {
                content: {
                    description: this.description, 
                    outcomes: this.outcomes,
                    strategies: this.strategies,
                    textbooks:  this.textbooks
                }
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

    static async getSyllabus(syllabusID)
    {
        const data = await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, syllabusID).withConverter(syllabusConverter))
        return data.data()
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

const syllabusConverter = {
    toFirestore: (syllabus) => {
        return {
            content: {
                description: syllabus.description, 
                outcomes: syllabus.outcomes,
                strategies: syllabus.strategies,
                textbooks:  syllabus.textbooks
            },
        };
    },
    fromFirestore: (snapshot, options) => {
        let d = snapshot.data(options).content;
        return new Syllabus(snapshot.id, d.description, d.outcomes, d.strategies, d.textbooks);
    }
};