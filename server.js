const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "spicyfood123";
const ACCESS_TOKEN = "EAARuonEIWFMBPP3MuKyOr18nh9JVt1R5ZB7h2P9jtZALYCf3hTDWZCE7eGZAC56tlxHACO5ZCqgkNJU3oUrIv6NHCxP2oonQDycSrMmjw0tEbxBzmeOMf16dWQC2NMhDQZA6p9vpI1uvOjH3D8W0qZBxTPivkWiiQaNPKy2JbCGozejAD9E5XcnFsQPwHVffRmLpTZCydYWSssSapoSnAuwo6zi6mDBr9Rh1MAPUlwmA2t3eMAZDZD";
const PHONE_NUMBER_ID = "712877165243022";

app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/", async (req, res) => {
  const body = req.body;
  console.log("📨 Incoming message:", JSON.stringify(body, null, 2));

  if (body.object) {
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      const from = message.from;
      const text = message.text?.body;

      await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: `You said: ${text}` },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
