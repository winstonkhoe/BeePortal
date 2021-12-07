import { Class } from '../model/Class.js'
import { User } from '../model/User.js'

export class ClassController{
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

        return classList
    }

    static async getAllCourseClasses(courseID)
    {
        let classList = await Class.getAllCourseClasses(courseID)
        return classList
    }


}
