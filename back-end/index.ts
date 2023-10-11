import db from "./models";
import Country from "./models";
import Office from "./models";

db.sequelize
  .sync()
  .then(() => {
    console.log("DB connection successful.");
  })
  .then(() => {
    db.Country.findAll().then((countries: any) => {
      console.log(countries);
    });
  })

  .catch((err: any) => {
    console.error(err);
  });
