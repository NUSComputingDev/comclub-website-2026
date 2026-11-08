/* eslint-disable @stylistic/max-len -- brand SVG paths are single long strings */
import React from 'react';
import { GlobeAltIcon, MailIcon } from '@heroicons/react/solid';
import { MemberPhoto, MemberProfile, MemberSocials, RoleMember } from './RoleCard';
import './MemberModal.css';

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z' />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
    </svg>
  );
}

interface MemberModalProps {
  member: RoleMember;
  onClose: () => void;
}

const SOCIALS: { key: keyof MemberSocials; label: string }[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'website', label: 'Website' },
];

function profileSocials(profile: MemberProfile) {
  return SOCIALS
    .map((social) => ({
      ...social,
      url: profile.socials?.[social.key],
    }))
    .filter((social): social is typeof social & { url: string } => Boolean(social.url));
}

function SocialIcon({ name }: { name: keyof MemberSocials }) {
  const className = 'member-modal-action-icon';

  switch (name) {
    case 'instagram':
      return <InstagramIcon className={className} aria-hidden='true' />;
    case 'github':
      return <GitHubIcon className={className} aria-hidden='true' />;
    case 'linkedin':
      return <LinkedInIcon className={className} aria-hidden='true' />;
    default:
      return <GlobeAltIcon className={className} aria-hidden='true' />;
  }
}

interface QuoteBlockProps {
  quote: string;
  note?: string;
  style?: 'terminal' | 'note';
}

function QuoteTerminal({ quote, note }: { quote: string; note?: string }) {
  return (
    <div className='member-quote-terminal'>
      <span className='member-quote-line'>
        {
          !quote.trim().startsWith('$') && (
            <span className='member-quote-prompt' aria-hidden='true'>&gt;</span>
          )
        }
        <span className='member-quote-text'>{quote}</span>
        <span className='member-quote-caret' aria-hidden='true'>█</span>
      </span>
      {
        note && (
          <span className='member-quote-comment'># {note}</span>
        )
      }
    </div>
  );
}

function QuoteBlock({ quote, note, style = 'terminal' }: QuoteBlockProps) {
  if (style === 'note') {
    return (
      <div className='member-quote-note'>
        <span className='member-quote-note-text'>{quote}</span>
      </div>
    );
  }

  return <QuoteTerminal quote={quote} note={note}></QuoteTerminal>;
}

interface ProfileBodyProps {
  member: RoleMember;
  profile?: MemberProfile;
}

function ProfileBody({ member, profile }: ProfileBodyProps) {
  const socials = profile ? profileSocials(profile) : [];

  return (
    <div className='member-modal-body'>
      <span className='member-modal-wing'>{member.wing}</span>
      {
        member.section && (
          <span className='role-section'>
            <span
              className={`role-dot section-${member.sectionIndex % 6}`}
              aria-hidden='true'
            ></span>
            {member.section}
          </span>
        )
      }
      <h3 id='member-modal-name'>{member.name}</h3>
      {
        profile?.displayName && (
          <span className='member-modal-aka'>aka {profile.displayName}</span>
        )
      }
      <p>{member.role}</p>
      {
        profile?.major && (
          <p className='member-modal-major'>{profile.major}</p>
        )
      }
      {
        profile?.gradYear && (
          <p className='member-modal-class'>Class of {profile.gradYear}</p>
        )
      }
      {
        profile?.quote && (
          <QuoteBlock
            quote={profile.quote}
            note={profile.quoteNote}
            style={profile.quoteStyle}
          ></QuoteBlock>
        )
      }
      {
        (profile?.email || socials.length > 0) && (
          <div className='member-modal-actions'>
            {
              profile?.email && (
                <a
                  className='member-modal-action'
                  href={`mailto:${profile.email}`}
                >
                  <MailIcon className='member-modal-action-icon' aria-hidden='true' />
                  {profile.email}
                </a>
              )
            }
            {
              socials.map((social) => (
                <a
                  key={social.key}
                  className='member-modal-action'
                  href={social.url}
                  target='_blank'
                  rel='noreferrer'
                >
                  <SocialIcon name={social.key}></SocialIcon>
                  {social.label}
                </a>
              ))
            }
          </div>
        )
      }
      {
        member.isLead && member.wing !== 'P-Wing' && (
          <span className='member-modal-badge'>Wing Head</span>
        )
      }
    </div>
  );
}

function MemberModal({ member, onClose }: MemberModalProps) {
  return (
    <div
      className='member-modal-backdrop'
      role='presentation'
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className='member-modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='member-modal-name'
      >
        <button
          type='button'
          className='member-modal-close'
          onClick={onClose}
          aria-label='Close member details'
        >
          &times;
        </button>
        <div className='member-modal-photo'>
          <MemberPhoto member={member} />
        </div>
        <ProfileBody member={member} profile={member.profile}></ProfileBody>
      </div>
    </div>
  );
}

export default MemberModal;
