import React from 'react';

// Matches http(s) URLs. The capturing group keeps the URLs when splitting.
const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g;
// Non-global twin used for per-part testing (a /g regex's .test() is stateful).
const URL_TEST_REGEX = /^https?:\/\/[^\s]+$/;

interface LinkifyProps {
  children: string;
}

/**
 * Renders plain text, turning any http(s) URL it contains into a clickable link.
 * Newlines are preserved by the caller's CSS (e.g. `whitespace-pre-wrap`).
 */
function Linkify({ children }: LinkifyProps) {
  const parts = children.split(URL_SPLIT_REGEX);

  return (
    <>
      {parts.map((part, index) =>
        URL_TEST_REGEX.test(part) ? (
          <a
            key={index}
            href={part}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary underline break-all'>
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default Linkify;
