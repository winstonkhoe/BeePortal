import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, query, where, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { Class } from "./Class.js";
import { User } from "./User.js";

export class Schedule {
    static _CollectionName = "Schedules"

    constructor(scheduleID, credits, start, end)
    {
        this.scheduleID = scheduleID
       this.credits = credits
       this.start = start
       this.end = end
    }

    async insertSchedule()
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
    
    async updateSchedule()
    {

    }

    async removeSchedule()
    {

    }

    static async getSchedule(scheduleID)
    {
        const data = await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, scheduleID).withConverter(scheduleConverter))
        return data.data()
    }

    static async getAllScheduleByCredits(credits)
    {
        console.log(credits)
        const queryGetAllScheduleByCredits = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("credits", "==", Number(credits))).withConverter(scheduleConverter);
        let datas = await getDocs(queryGetAllScheduleByCredits)
        console.log(datas.docs[0].data())
        let scheduleList = datas.docs.map((d) => {
            console.log(d.data())
            return d.data()
        })
        
        return scheduleList
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

const scheduleConverter = {
    toFirestore: (schedule) => {
        return {
            scheduleID: schedule.scheduleID, 
            credits: schedule.credits,
            start: schedule.start,
            end:  schedule.end
        };
    },
    fromFirestore: (snapshot, options) => {
        let d = snapshot.data(options);
        return new Schedule(snapshot.id, d.credits, d.start, d.end);
    }
};
