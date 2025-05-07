import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import styles from '../components/ContactPage.module.scss';

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
    <div className={styles.contactContainer}>
      <h1 className={styles.title}>Contact Us</h1>

      {submitted ? (
        <p className={styles.successMessage}>
          Thanks for reaching out! We'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      )}

      <div className={styles.githubSection}>
        <FaGithub size={24} className="text-gray-700" />
        <a
          href="https://github.com/trey-dew"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
      </div>
    </div>
  );
}

export default ContactPage;
