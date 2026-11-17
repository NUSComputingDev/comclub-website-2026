import React, { useState } from 'react';
import './index.css';

const TOPICS = ['General', 'Events', 'Welfare', 'Website', 'Other'];

function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General');
  const [message, setMessage] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Computing Club feedback — ${topic}`;
    const body = [
      `Name: ${name.trim() || '—'}`,
      `Email: ${email.trim() || '—'}`,
      `Topic: ${topic}`,
      '',
      message.trim(),
    ].join('\n');

    const query = `subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(body)}`;
    window.location.href = `mailto:connect@nuscomputing.com?${query}`;
  }

  return (
    <div className='feedback-page'>
      <div className='feedback-card'>
        <span className='feedback-kicker'>We&#39;re listening</span>
        <h1>Feedback</h1>
        <p className='feedback-lead'>
          Tell us what&#39;s working, what isn&#39;t, or what you&#39;d like to
          see from the club. It goes straight to the committee.
        </p>

        <form className='feedback-form' onSubmit={handleSubmit}>
          <div className='feedback-row'>
            <label>
              Name <span>(optional)</span>
              <input
                type='text'
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder='Your name'
              />
            </label>
            <label>
              Email <span>(optional)</span>
              <input
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='you@u.nus.edu'
              />
            </label>
          </div>

          <label>
            Topic
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              {
                TOPICS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))
              }
            </select>
          </label>

          <label>
            Message
            <textarea
              required
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder='What would you like us to know?'
            ></textarea>
          </label>

          <button type='submit' className='feedback-submit'>
            Send feedback
          </button>
        </form>

        <p className='feedback-note'>
          This opens your email app with everything filled in. Prefer to write
          directly? <a href='mailto:connect@nuscomputing.com'>connect@nuscomputing.com</a>
        </p>
      </div>
    </div>
  );
}

export default Feedback;
