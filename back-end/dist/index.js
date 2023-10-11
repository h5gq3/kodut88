"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("./models"));
models_1.default.sequelize
    .sync()
    .then(() => {
    console.log("DB connection successful.");
})
    .then(() => {
    models_1.default.Country.findAll().then((countries) => {
        console.log(countries);
    });
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map