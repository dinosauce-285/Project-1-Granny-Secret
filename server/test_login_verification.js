fetch("http://localhost:4000/api/auth/google-login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "apikey",
  },
  body: JSON.stringify({ token: "fake_token" }),
})
  .then(async (res) => {
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  })
  .catch((err) => console.error("Error:", err));
