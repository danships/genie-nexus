import { getNextAuthUserRepository } from "@genie-nexus/database";
import { getCredentialsAuthorize } from "./credentials.js";
import Credentials from "next-auth/providers/credentials";

export async function createCredentialsProvider() {
  const userRepository = await getNextAuthUserRepository();
  return Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: getCredentialsAuthorize(userRepository),
  });
}
