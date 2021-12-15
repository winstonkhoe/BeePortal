import { Class } from '../model/Class.js'
import { User } from '../model/User.js'

export class ClassController{
    
    static async insertClass(classID, courseID, classCode, studentID, lecturerID, day, scheduleID)
    {
        let c = new Class(classID, courseID, classCode, studentID, lecturerID, day, scheduleID)
        let result = await c.insertClass()
        if(result !== false)
        {
            //redirect to assign student and lecturer
            window.location.assign(`./assignStudentLecturer.html?class_id=${result}`)
        }
        else
        {
            return false
        }
    }

    static async updateClass(classID, lecturerID, studentID)
    {
        return await Class.updateClass(classID, lecturerID, studentID) == true ? window.location.assign(`./class.html`) : false
    }
    
    static async getClass(classID)
    {
        let c = await Class.getClass(classID)
        return c
    }

    static async getAllClass(userID)
    {
        let u = await User.getUser(userID)
        var classList 
        if(u.role == 'student')
        {
            classList = await Class.getAllStudentClass(u.userID)
        }
        else if(u.role == 'lecturer')
        {
            classList = await Class.getAllLecturerClass(u.userID) 
        }
        else if(u.role == 'administrative department')
        {
            classList = await Class.getAllClass()
        }

        return classList
    }

    static async getAllStudentListByClass(classID)
    {
        let students = await Class.getAllStudentListByClass(classID)
        return students
    }

    static async getAllLecturerListByClass(classID)
    {
        let lecturer = await Class.getAllLecturerListByClass(classID)
        return lecturer
    }

    static async getAllCourseClasses(courseID)
    {
        let classList = await Class.getAllCourseClasses(courseID)
        return classList
    }


}
