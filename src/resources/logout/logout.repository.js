import Logout from "./logout.model.js";

export default class LogoutRepository {
  static async userLogout(data) {
    return await Logout.create(data);
  }
}
