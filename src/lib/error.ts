export function handleErrorGracefully(error: string) {
  if (error.includes("User not found") || error.includes("Unauthorized")) {
    return "User not found";
  }
  return { error };
}
