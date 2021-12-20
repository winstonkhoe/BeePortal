import { Answer, GroupAnswer } from '../model/Answer.js'

export class AnswerController{

    static async getAnswer(answerID)
    {
        return await Answer.getAnswer(answerID)
    }

    static async insertAnswer(assignmentID, userID, answer)
    {
        await Answer.setExistingAnswerIsUpdated(assignmentID, userID)
        let ans = new Answer(null, assignmentID, userID, answer, null)
        return await ans.insertAnswer()
    }

    static async insertGroupAnswer(assignmentID, userID, answer)
    {
        let groupID = await Answer.setExistingAnswerIsUpdated(assignmentID, userID)
        let ans = new GroupAnswer(null, assignmentID, userID, groupID, answer, null)
        return await ans.insertAnswer()
    }
    
    static async getStudentAnswerOfIndividualAssignment(assignmentID, userID)
    {
        let answers = await Answer.getStudentAnswerOfIndividualAssignment(assignmentID, userID)
        return answers
    }

}
