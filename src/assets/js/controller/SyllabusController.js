import { Syllabus } from '../model/Syllabus.js'

export class SyllabusController{
    static async getSyllabus(syllabusID)
    {
        let syllabus = await Syllabus.getSyllabus(syllabusID)
        return syllabus
    }
}
