import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import NavBar from '../components/NavBar'


function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_fvgyrlc', 'template_voawpqo', e.target, 'Uc4nD4gsnEUfn4Jdg')
      .then((result) => {
        console.log('Email sent successfully:', result.text);
      }, (error) => {
        console.error('Error sending email:', error.text);
      });

    // Clear form fields
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <NavBar/>
      <div className='flex justify-center items-center h-screen flex-col'>
        <h1 className="text-7xl font-bold mb-7">Contact <span className='text-secondary'>us.</span></h1>
        
      <form onSubmit={handleSubmit}>
      <div className="w-full max-w-xs">
          <label className="form-control my-3">
            <div className="label">
            <span className="label-text card-title">What is your email?</span>
            </div>
          <input type="email" name="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full"/>
        </label>
        <label className="form-control">
            <div className="label">
              <span className="label-text card-title">Any suggestions?</span>
            </div>
          <textarea name="message" className="textarea text-base textarea-bordered textarea-lg w-full max-w-xs" value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <button className='btn btn-secondary my-4' type="submit">Send</button>
        </div>
      </form>
      </div>
    </>
  );
}

export default Contact;