import Storage from "./storage";
import type { User } from "./types";

export class UserStorage extends Storage {
  private static PATH = 'user';

  set user(user: User | undefined) {
    this.set(UserStorage.PATH, user);
  }

  get user() {
    return this.get<User>(UserStorage.PATH)
  }
}
