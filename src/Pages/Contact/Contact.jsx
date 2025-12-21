// src/Pages/Contact/Contact.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Contact = () => {
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post('/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4 text-gray-700">
        Have questions or feedback? Fill out the form below and we'll get back to you soon.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="textarea textarea-bordered w-full"
            rows={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
