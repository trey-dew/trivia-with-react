import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      {submitted ? (
        <p className="text-center text-green-600 text-xl font-semibold">
          Thanks for reaching out! We'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <div className="w-96">
            <label className="block text-gray-700 text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="w-96">
            <label className="block text-gray-700 text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="w-96">
            <label className="block text-gray-700 text-lg font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-48 bg-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      )}

      <div className="mt-10 flex items-center justify-center gap-2">
        <FaGithub size={28} className="text-gray-700" />
        <a
          href="https://github.com/trey-dew"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xl"
        >
          github
        </a>
      </div>
    </div>
  );
}

export default ContactPage;
