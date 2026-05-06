const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const config = {
    user: "utkarshadmin",
    password: "Azure@12345",
    server: "utkarshserver123.database.windows.net",
    database: "expense-db2",
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    port: 1433
};

app.get("/", async (req, res) => {

    try {

        await sql.connect(config);

        const result =
          await sql.query`SELECT * FROM expenses`;

        res.render("index", {
            expenses: result.recordset
        });

    } catch (err) {

        console.log(err);

        res.send("Database connection failed");
    }
});

app.post("/add", async (req, res) => {

    const { title, amount, category, date } = req.body;

    await sql.connect(config);

    await sql.query`
        INSERT INTO expenses
        (title, amount, category, expense_date)

        VALUES
        (${title}, ${amount}, ${category}, ${date})
    `;

    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});