import { Exam } from '../model/Exam.js'

export class ExamController{
    static async getExam(examID)
    {
        return await Exam.getExam(examID)
    }

    static async insertExam(classID, start, end, type)
    {
        let exam = new Exam(null, classID, start, end, null, type)
        return await exam.insertExam()
    }

    static async getAllExamOfStudent(userID)
    {
        return await Exam.getAllExamOfStudent(userID)
    }

    static async getAllExam()
    {
        return await Exam.getAllExam()
    }

    static async assignProctor(examID, proctorID)
    {
        return await Exam.assignProctor(examID, proctorID)
    }

    static async getAllExamOfProctor(userID)
    {
        return await Exam.getAllExamOfProctor(userID)
    }
}
