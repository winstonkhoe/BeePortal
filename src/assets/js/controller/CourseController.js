import { Course } from '../model/Course.js'

export class CourseController{
    static async getCourse(courseID)
    {
        let courses = await Course.getCourse(courseID)
        return courses
    }

    static async getUniqueCourses(userID)
    {
        let courses = await Course.getUniqueCourses(userID)
        return courses
    }
}
