import { BeeDatabase } from "../database.js";
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, getFirestore, setDoc, query, where, updateDoc, arrayUnion, Timestamp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js'
import { User } from "./User.js";

export class Group {
    static _CollectionName = "Groups"

    constructor(groupID, group, userID)
    {
       this.groupID = groupID
       this.group = group
       this.userID = userID
    }

    async insertGroup()
    {
        try {
            let d = await Promise.all(addDoc(collection(BeeDatabase.getDatabase(), "Classes"), {
                courseID: doc(BeeDatabase.getDatabase(), "Courses", this.courseID), 
                classCode: this.classCode, 
                schedule: {
                    day: this.day,
                    scheduleID: doc(BeeDatabase.getDatabase(), "Schedules", this.scheduleID)
                }
            }));
            return d.id
        } catch (error) {
            return false
        }
    }
    
    static async updateClass(classID, lecturerID, studentID)
    {
        try {
            await Promise.all(lecturerID.map( async (id) => {
                console.log('lecturer: ' + id)
                await updateDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, classID), {
                    lecturerID: arrayUnion(doc(BeeDatabase.getDatabase(), "Users", id))
                });
            }))
            
            await Promise.all(studentID.map( async (id) => {
                console.log('students: ' + id)
                await updateDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, classID), {
                    studentID: arrayUnion(doc(BeeDatabase.getDatabase(), "Users", id))
                });
            }))
            return true
        } catch (error) {
            return false
        }
    }

    async removeForum()
    {

    }

    static async getGroup(groupID)
    {
        let data = await getDoc(doc(BeeDatabase.getDatabase(), this._CollectionName, groupID).withConverter(groupConverter))
        
        return data.data()
    }

    static async getGroupIDofUser()
    {
        let data = await getDocs((collection(BeeDatabase.getDatabase(), this._CollectionName)).withConverter(groupConverter))
        let classList = data.docs.map((d) => {
            return d.data()
        })

        return classList
    }

    static async getAllStudentListByClass(classID)
    {
        // console.log(classID)
        let c = await this.getClass(classID)
        let userList = []
        if(c.studentID)
        {
            userList = await Promise.all (c.studentID.map( async (studentRef) => {
                return await User.getUser(studentRef.id)
            }))
        }

        return userList
    }

    static async getAllLecturerListByClass(classID)
    {
        let c = await this.getClass(classID)
        let lecturerList = []
        if(c.lecturerID)
        {
            lecturerList = await Promise.all(c.lecturerID.map( async (lecturerRef) => {
                return await User.getUser(lecturerRef.id)
            }))
        }
        
        return lecturerList
    }

    static async getAllStudentClass(studentID)
    {
        const queryGetAllStudentClass = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("studentID", "array-contains", doc(BeeDatabase.getDatabase(), "Users", studentID))).withConverter(groupConverter);
        let datas = await getDocs(queryGetAllStudentClass)
        let classList = datas.docs.map((d) => {
            return d.data()
        })
        
        return classList
    }

    static async getAllLecturerClass(lecturerID)
    {
        const queryGetAllLecturerClass = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("lecturerID", "array-contains", doc(BeeDatabase.getDatabase(), "Users", lecturerID))).withConverter(groupConverter);
        let datas = await getDocs(queryGetAllLecturerClass)
        let classList = datas.docs.map((d) => {
            return d.data()
        })

        return classList
    }

    static async getAllCourseClasses(courseID)
    {
        const queryGetAllCourseClasses = query(collection(BeeDatabase.getDatabase(), this._CollectionName), where("courseID", "==", doc(BeeDatabase.getDatabase(), "Courses", courseID))).withConverter(groupConverter);
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

const groupConverter = {
    toFirestore: (c) => {
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
    fromFirestore: async (snapshot, options) => {
        let d = snapshot.data(options);
        let userList = await Promise.all(d.userID.map( async (user) => {
            return await User.getUser(user.id)
        }))
        return new Group(snapshot.id, d.group, userList);
    }
};