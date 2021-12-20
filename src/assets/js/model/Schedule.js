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

    static async getSchedule(scheduleID)
    {
        const data = await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, scheduleID.id).withConverter(scheduleConverter))
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
