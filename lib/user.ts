export function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("lct_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("lct_user_id", id);
  }
  return id;
}
