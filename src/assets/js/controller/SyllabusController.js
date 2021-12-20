import { Syllabus } from '../model/Syllabus.js'

export class SyllabusController{
    static async getSyllabus(syllabusID)
    {
        let syllabus = await Syllabus.getSyllabus(syllabusID)
        return syllabus
    }

    static async insertEmpty()
    {
        let syllabus = new Syllabus(null, null, null, null, null)
        return await syllabus.insertEmpty()
    }
}
