import { repository } from "@/config/prisma";

export class ProfileService {
  constructor() { }

  getAll = async () => {
    try {
      const profiles = await repository.profile.findMany()
      return profiles
    } catch (error) {
      throw new Error("Error fetching profiles");
    }
  };

  getOne = async (code: string) => {
    try {
      const profile = await repository.profile.findUnique({
        where: {
          id: code
        }
      })
      if (!profile) {
        return null;
      }
      return profile
    } catch (error) {
      throw new Error("Error fetching profile");
    }
  };
}
