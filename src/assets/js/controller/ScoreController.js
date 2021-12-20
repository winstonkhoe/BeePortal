import { Score } from "../model/Score.js";

export class ScoreController {
  static async getScore(scoreID) {
    return await Score.getScore(scoreID);
  }

  static async getExistingScore(taskID, userID)
  {
    return await Score.getScoreDocument(taskID, userID, false)
  }
  
  static async insertScore(classID, taskID, userID, score) {
    await Score.setExistingScoreIsUpdated(taskID, userID);
    let taskType = await Score.getTaskType(taskID);
    let scoreObj = new Score(null, classID, taskID, userID, score, false, taskType, false);
    return await scoreObj.insertScore();
  }

  static async finalizeScore(taskID, userID) {
    return await Score.finalizeScore(taskID, userID);
  }

  static async checkReported(taskID, userID) {
    return await Score.checkReported(taskID, userID)
  }

  static async reportCheating(taskID, userID) {
    return await Score.reportCheating(taskID, userID)
  }
}
