import { cookies } from "next/headers";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token");
  
  if (!token?.value) {
    return false;
  }
  
  // Basic check for token existence. 
  // In a stricter setup, you would verify the JWT signature here using the Supabase JWT secret.
  return true;
}
