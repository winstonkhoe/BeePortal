import { Course } from '../model/Course.js'

export class CourseController{
    static async getCourse(courseID)
    {
        return await Course.getCourse(courseID)
    }

    static async getAllCourses()
    {
        return await Course.getAllCourses()
    }
    
    static async getUniqueCourses(userID)
    {
        return await Course.getUniqueCourses(userID)
       
    }
}
