import app from "./main";

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});
