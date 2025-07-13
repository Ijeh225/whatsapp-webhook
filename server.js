const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Webhook verification
app.get('/', (req, res) => {
  const verify_token = "spicyfood123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(PORT, () => console.log(`Webhook server is running on port ${PORT}`));
