import { User } from "../model/User.js";

export class UserController {
  static async auth(email, password) {
    const Users = await User.auth(email, password);
    if (!Users.empty) {
      Users.forEach((u) => {
        if (u.email == email && u.password == password) {
          localStorage.setItem("user_id", u.userID);
          window.location.assign(`./home.html`);
        }
      });
    }
  }
}
