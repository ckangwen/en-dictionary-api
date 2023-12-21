export default defineEventHandler((e) => {
  handleCors(e, {
    origin: "*",
    methods: "*",
  });
});
