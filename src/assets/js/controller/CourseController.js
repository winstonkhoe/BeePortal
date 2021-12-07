import { Course } from '../model/Course.js'

export class CourseController{
    static async getCourse(courseID)
    {
        let courses = await Course.getCourse(courseID)
        return courses
    }
}
