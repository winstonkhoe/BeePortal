import { Course } from '../model/Course.js'
import { Syllabus } from '../model/Syllabus.js'

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

    static async insertCourse(courseID, name, credits)
    {
        let tempCourse = await this.getCourse(courseID)
        if(!tempCourse)
        {
            let syllabus = new Syllabus(null, null, null, null, null)
            let syllabusID = await syllabus.insertEmpty()
            let course = new Course(courseID, name, syllabusID, credits)
            let success =  await course.insertCourse()
            if(success === true) window.location.assign(`./addSyllabus.html?course_id=${courseID}`)
            else return false
        }
        else return false
    }
}
