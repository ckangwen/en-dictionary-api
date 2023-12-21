export default defineEventHandler(async (e) => {
  const searchParams = new URLSearchParams(e.path.split("?")[1]);
  const name = searchParams.get("name");

  const res = await fetchWordMeaning(name);
  return res;
});
