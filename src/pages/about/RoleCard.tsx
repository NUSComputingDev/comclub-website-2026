import React, { useState } from 'react';
import { EyeIcon, UserIcon } from '@heroicons/react/solid';
import './RoleCard.css';

export interface MemberSocials {
  instagram?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface MemberProfile {
  displayName?: string;
  major?: string;
  gradYear?: string;
  email?: string;
  quote?: string;
  quoteNote?: string;
  quoteStyle?: 'terminal' | 'terminal-danger' | 'note' | 'zen' | 'quest' | 'fire';
  socials?: MemberSocials;
}

export interface RoleMember {
  name: string;
  role: string;
  title: string;
  shortName?: string;
  callName?: string;
  imgSrc: string;
  wing: string;
  section?: string;
  sectionIndex: number;
  isLead: boolean;
  profile?: MemberProfile;
}

interface MemberPhotoProps {
  member: RoleMember;
}

/**
 * Renders the member photo, falling back to a friendly placeholder while a
 * photo for a new committee member hasn't been added yet.
 */
export function MemberPhoto({ member }: MemberPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className='member-photo-fallback'
        aria-label={`Photo of ${member.name} coming soon`}
      >
        <UserIcon className='member-photo-fallback-icon' aria-hidden='true' />
        <span className='member-photo-fallback-text'>Picture coming soon</span>
      </span>
    );
  }

  return (
    <img
      src={member.imgSrc}
      alt={member.name}
      width={480}
      height={640}
      loading='lazy'
      decoding='async'
      onError={() => setFailed(true)}
    ></img>
  );
}

interface RoleCardProps {
  member: RoleMember;
  onSelect: (member: RoleMember) => void;
}

function NameText({ name, callName }: { name: string; callName?: string }) {
  if (!callName) {
    return <>{name}</>;
  }

  const index = name.indexOf(callName);
  if (index === -1) {
    return <>{name}</>;
  }

  return (
    <>
      {name.slice(0, index)}
      <span className='role-name-strong'>{callName}</span>
      {name.slice(index + callName.length)}
    </>
  );
}

function RoleCard(props: RoleCardProps) {
  const { member, onSelect } = props;

  return (
    <li className={`role-card-item ${member.isLead ? 'lead' : ''}`}>
      <button
        type='button'
        className='role-card'
        onClick={() => onSelect(member)}
        aria-label={`View details for ${member.name}, ${member.role}`}
      >
        <span className='role-photo'>
          <MemberPhoto member={member} />
          {
            member.isLead && member.wing !== 'P-Wing' && (
              <span className='role-badge'>Wing Head</span>
            )
          }
          <span
            className={`role-photo-hint${member.profile ? ' is-profile' : ''}`}
            aria-hidden='true'
          >
            <EyeIcon className='role-photo-hint-icon' />
            <span className='role-photo-hint-text'>View profile</span>
          </span>
        </span>
        <span className='role-info'>
          <span className='role-section'>
            {
              member.section && (
                <span
                  className={`role-section-text section-color-${member.sectionIndex % 6}`}
                >
                  {member.section}
                </span>
              )
            }
          </span>
          <span className='role-name'>
            <NameText name={member.name} callName={member.callName}></NameText>
          </span>
          <span className='role-title'>{member.title}</span>

        </span>
      </button>
    </li>
  );
}

export default RoleCard;
