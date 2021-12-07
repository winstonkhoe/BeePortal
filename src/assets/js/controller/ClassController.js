import { Class } from '../model/Class.js'
import { User } from '../model/User.js'

export class ClassController{
    static async getAllClass(userID)
    {
        let u = await User.getUser(userID)
        var class_list 
        if(u.role == 'student')
        {
            class_list = await Class.getAllStudentClass(u.userID)
        }
        else if(u.role == 'lecturer')
        {
            class_list = await Class.getAllLecturerClass(u.userID) 
        }

        return class_list
    }
}
