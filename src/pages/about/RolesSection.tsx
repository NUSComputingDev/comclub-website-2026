import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import WindowCard from '../../layout/WindowCard';
import RoleCard, { MemberPhoto, RoleMember } from './RoleCard';
import roles from './roles.json' with {type: 'json'};
import './RolesSection.css';

interface Member {
  name: string;
  role: string;
  img?: string;
}

interface ParsedRole {
  title: string;
  section?: string;
}

/**
 * Roles are written as `Title, Section`. The section is everything after the
 * first comma, and an optional parenthesised detail (e.g. `Marketing (Merchandise)`)
 * is folded into the displayed title so it doesn't take over the section label.
 */
function parseRole(role: string): ParsedRole {
  const comma = role.indexOf(',');
  if (comma === -1) {
    return { title: role.trim() };
  }

  const title = role.slice(0, comma).trim();
  const tail = role.slice(comma + 1).trim();
  const detail = tail.match(/\(([^)]+)\)/)?.[1];
  const section = tail.replace(/\([^)]*\)/g, '').trim();

  return {
    title: detail ? `${title} · ${detail}` : title,
    section: section || undefined,
  };
}

/**
 * Keep the wing head first, then group everyone else by section so members of
 * the same section sit next to each other.
 */
function orderMembers(members: Member[]): RoleMember[] {
  const sections: string[] = [];
  const parsed = members.map((member) => {
    const { title, section } = parseRole(member.role);
    if (section && !sections.includes(section)) {
      sections.push(section);
    }
    return { member, title, section };
  });

  const [head, ...rest] = parsed;
  rest.sort((a, b) => {
    const aIndex = a.section ? sections.indexOf(a.section) : sections.length;
    const bIndex = b.section ? sections.indexOf(b.section) : sections.length;
    return aIndex - bIndex;
  });

  return [head, ...rest].map(({ member, title, section }) => ({
    name: member.name,
    role: member.role,
    title,
    wing: '',
    imgSrc: member.img ?? `/members/thumbs/${member.name.replace(/[^A-Za-z0-9]/g, '')}.webp`,
    section,
    sectionIndex: section ? sections.indexOf(section) : -1,
    isLead: false,
  }));
}

interface WingCardProps {
  wing: string;
  members: Member[];
  defaultOpen: boolean;
  onSelect: (member: RoleMember) => void;
}

function WingCard({ wing, members, defaultOpen, onSelect }: WingCardProps) {
  const [open, setOpen] = useState(
    () => defaultOpen || window.matchMedia('(min-width: 768px)').matches,
  );

  const ordered = orderMembers(members).map((member, index) => ({
    ...member,
    wing,
    isLead: index === 0,
  }));

  const contentId = `wing-${wing.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <WindowCard
      title={
        <button
          type='button'
          className='wing-toggle'
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={contentId}
        >
          <span className='wing-title'>{wing}</span>
          <span className='wing-count'>{members.length}</span>
          <ChevronDownIcon
            className={`wing-chevron ${open ? 'open' : ''}`}
            aria-hidden='true'
          />
        </button>
      }
      content={
        <div id={contentId} hidden={!open}>
          <ul className='member-grid'>
            {
              ordered.map((member) => (
                <RoleCard
                  member={member}
                  onSelect={onSelect}
                  key={member.name}
                ></RoleCard>
              ))
            }
          </ul>
        </div>
      }
    ></WindowCard>
  );
}

function RolesSection() {
  const [selected, setSelected] = useState<RoleMember | null>(null);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected]);

  return (
    <div className='roles-section'>
      {
        Object.entries(roles).map(([wing, members], index) => (
          <WingCard
            key={wing}
            wing={wing}
            members={members}
            defaultOpen={index === 0}
            onSelect={setSelected}
          ></WingCard>
        ))
      }

      {
        selected && (
          <div
            className='member-modal-backdrop'
            role='presentation'
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelected(null);
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
                onClick={() => setSelected(null)}
                aria-label='Close member details'
              >
                &times;
              </button>
              <div className='member-modal-photo'>
                <MemberPhoto member={selected} />
              </div>
              <div className='member-modal-body'>
                <span className='member-modal-wing'>{selected.wing}</span>
                {
                  selected.section && (
                    <span className='role-section'>
                      <span
                        className={`role-dot section-${selected.sectionIndex % 6}`}
                        aria-hidden='true'
                      ></span>
                      {selected.section}
                    </span>
                  )
                }
                <h3 id='member-modal-name'>{selected.name}</h3>
                <p>{selected.role}</p>
                {
                  selected.isLead && selected.wing !== 'P-Wing' && (
                    <span className='member-modal-badge'>Wing Head</span>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default RolesSection;
