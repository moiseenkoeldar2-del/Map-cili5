const express = require("express");
const axios = require("axios");
const app = express();

const TOKEN = "8768315457:AAFS-VgnCBZrhlFykygxZM2fbvVAGYqA9EM";
const CHAT_ID = "-1003889208990";

let lastUpdateId = 0;
let states = {};

app.get("/data", (req, res) => {
    res.json(states);
});

async function checkTelegram() {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${TOKEN}/getUpdates`);

        res.data.result.forEach(update => {
            if (update.update_id > lastUpdateId) {
                lastUpdateId = update.update_id;

                const msg = update.message?.text?.toLowerCase();
                if (!msg) return;

                if (update.message.chat.id != CHAT_ID) return;

                if (msg.includes("тривога") && msg.includes("дніпровський")) {
                    states["дніпровський"] = "red";
                }

                if (msg.includes("відбій") && msg.includes("дніпровський")) {
                    states["дніпровський"] = "green";
                }
            }
        });

    } catch (e) {
        console.log(e.message);
    }
}

setInterval(checkTelegram, 3000);

app.listen(process.env.PORT || 3000);
