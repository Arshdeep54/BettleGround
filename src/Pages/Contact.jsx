import React, { useState } from "react";
import emailjs from "emailjs-com";
import NavBar from "../components/NavBar";

function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_l79xkbg",
        "template_voawpqo",
        e.target,
        "Uc4nD4gsnEUfn4Jdg"
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
        },
        (error) => {
          console.error("Error sending email:", error.text);
        }
      );

    // Clear form fields
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <NavBar />
      <div>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Your Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Message:
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default Contact;
