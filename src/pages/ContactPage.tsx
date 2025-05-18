import { useState, useRef, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import styles from '../components/ContactPage.module.scss';
import emailjs from '@emailjs/browser';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lastSubmissionTime = useRef<number>(0);
  const submissionCount = useRef<number>(0);
  const submissionResetTimeout = useRef<NodeJS.Timeout>();

  // Reset submission count every hour
  useEffect(() => {
    return () => {
      if (submissionResetTimeout.current) {
        clearTimeout(submissionResetTimeout.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const isSpam = (data: typeof formData): boolean => {
    // Check for honeypot field
    if (data.website) return true;

    // Check for common spam patterns
    const spamPatterns = [
      /viagra/i,
      /casino/i,
      /lottery/i,
      /bitcoin/i,
      /crypto/i,
      /investment/i,
      /make money fast/i,
      /earn money/i,
      /work from home/i,
      /weight loss/i,
      /diet pills/i,
      /free money/i,
      /lottery winner/i,
      /inheritance/i,
      /bank transfer/i,
      /nigerian prince/i,
      /urgent reply/i,
      /dear friend/i,
      /congratulations/i,
      /you have won/i,
    ];

    return spamPatterns.some(pattern => 
      pattern.test(data.message) || 
      pattern.test(data.name) || 
      pattern.test(data.email)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;

    // Rate limiting: max 3 submissions per hour
    if (submissionCount.current >= 3) {
      setError('Too many submissions. Please try again later.');
      setIsLoading(false);
      return;
    }

    // Minimum time between submissions (30 seconds)
    if (timeSinceLastSubmission < 30000) {
      setError('Please wait a moment before submitting again.');
      setIsLoading(false);
      return;
    }

    // Check for spam
    if (isSpam(formData)) {
      setError('Your message appears to be spam. If this is an error, please try again later.');
      setIsLoading(false);
      return;
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'trey.dew.developer@gmail.com',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Update submission tracking
      lastSubmissionTime.current = now;
      submissionCount.current += 1;

      // Reset submission count after an hour
      if (submissionResetTimeout.current) {
        clearTimeout(submissionResetTimeout.current);
      }
      submissionResetTimeout.current = setTimeout(() => {
        submissionCount.current = 0;
      }, 3600000); // 1 hour

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      console.error('Error sending email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.title}>Contact Me</h1>

      {submitted ? (
        <p className={styles.successMessage}>
          Thanks for reaching out! We'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          {/* Honeypot field - hidden from real users but visible to bots */}
          <div style={{ display: 'none' }}>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={isLoading}
              maxLength={100}
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
              disabled={isLoading}
              maxLength={100}
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
              disabled={isLoading}
              maxLength={1000}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Submit'}
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
