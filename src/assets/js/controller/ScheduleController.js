import { Schedule } from '../model/Schedule.js'

export class ScheduleController{
    static async getSchedule(scheduleID)
    {
        return await Schedule.getSchedule(scheduleID)
    }

    static async getAllScheduleByCredits(credits)
    {
        return await Schedule.getAllScheduleByCredits(credits)
    }
}
