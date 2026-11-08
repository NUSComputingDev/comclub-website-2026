import React from 'react';
import { MailIcon } from '@heroicons/react/solid';
import { MemberPhoto, MemberProfile, MemberSocials, RoleMember } from './RoleCard';
import './MemberModal.css';

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

interface QuoteTerminalProps {
  quote: string;
}

function QuoteTerminal({ quote }: QuoteTerminalProps) {
  return (
    <div className='member-quote-terminal'>
      <span className='member-quote-text'>{quote}</span>
      <span className='member-quote-caret' aria-hidden='true'>█</span>
    </div>
  );
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
        profile?.quote && (
          <QuoteTerminal quote={profile.quote}></QuoteTerminal>
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
