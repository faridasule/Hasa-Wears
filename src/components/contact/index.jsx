import { useRef } from 'react';
import Card from '../../components/card/index';
import styles from './contact.module.scss';
import emailjs from '@emailjs/browser';
import { toaster } from 'evergreen-ui';

const Contact = () => {
  const form = useRef();

  // Function to handle form submission
  const sendEmail = (e) => {
    e.preventDefault();
    console.log(form.current);

    emailjs
      .sendForm(
        'service_554kout',
        'template_8qw6zgf',
        form.current, {
        publicKey: 'ZOvYQ5W94f_r9WCTH',
      }
      )
      .then(
        (result) => {
          toaster.success('Message sent successfully', {
            duration: 5
          });
        },
        (error) => {
          toaster.danger(error.text, {
            duration: 5
          });
        },
      )
    e.target.reset();
  };


  return (
    <section>
      <div className={`container ${styles.contact}`}>
        <div className={styles.section}>
          <form ref={form} onSubmit={sendEmail}>
            <Card cardClass={styles.card}>
              <h3 style={{ textAlign: 'center', marginBottom: '36px' }}>
                Lets get your response
              </h3>

              <label>FullName</label>
              <input type="text" name="user_name" required />
              <label>Email</label>
              <input type="email" name="user_email" required />
              <label>Subject</label>
              <input type="text" name="subject" required />
              <label>Write your message</label>
              <textarea name="message" cols="30" rows="10"></textarea>
              <div>
                <button
                  style={{ width: '100%' }}
                  className="--btn --btn-primary"
                >
                  Submit
                </button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
