import { SECONDS_IN_DAY } from "@Helpers/constants";
import Cache from "@Infrastructure/Utils/Cache";
import { v4 as uuid } from "uuid";

class SessionService {
  async create(user: Object | string) {
    const token = uuid();

    await Cache.set(token, user, { ttl: SECONDS_IN_DAY });

    return token;
  }

  async fetch(token: string) {
    const user = await Cache.get(token);

    return user;
  }

  async delete(token: string) {
    await Cache.delete(token);
  }
}

export default SessionService;
