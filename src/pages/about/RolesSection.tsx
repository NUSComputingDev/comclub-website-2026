import React, { useEffect, useMemo, useState } from 'react';
import { MemberPhoto, RoleMember } from './RoleCard';
import CommitteeTree, { WingBranch } from './CommitteeTree';
import roles from './roles.json' with {type: 'json'};
import './RolesSection.css';

interface Member {
  name: string;
  role: string;
  shortName?: string;
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
    shortName: member.shortName,
    wing: '',
    imgSrc: member.img ?? `/members/thumbs/${member.name.replace(/[^A-Za-z0-9]/g, '')}.webp`,
    section,
    sectionIndex: section ? sections.indexOf(section) : -1,
    isLead: false,
  }));
}

/**
 * The committee is a three-tier tree:
 *   1. The President heads P-Wing.
 *   2. P-Wing holds the office bearers and the four Vice Presidents.
 *   3. Each Vice President's wing holds its directors, grouped by section.
 */
function buildBranches(): WingBranch[] {
  const entries = Object.entries(roles) as [string, Member[]][];
  const [pWingEntry, ...wingEntries] = entries;

  if (!pWingEntry) {
    return [];
  }

  const [pWingName, pWingRaw] = pWingEntry;

  const wings = wingEntries.map(([wing, members]) => ({
    wing,
    members: orderMembers(members).map((member, index) => ({
      ...member,
      wing,
      isLead: index === 0,
    })),
  }));

  const [president, ...officeBearers] = orderMembers(pWingRaw).map((member, index) => ({
    ...member,
    wing: pWingName,
    isLead: index === 0,
  }));

  const vicePresidents = wings.map(({ wing, members: wingMembers }) => ({
    ...wingMembers[0],
    wing: pWingName,
    isLead: true,
    title: `${wingMembers[0].title} · ${wing}`,
  }));

  return [
    {
      wing: pWingName,
      subtitle: 'Executive Committee',
      featured: true,
      head: president,
      groups: [
        { label: 'Office Bearers', members: officeBearers },
        { label: 'Vice Presidents', members: vicePresidents },
      ],
    },
    ...wings.map(({ wing, members: wingMembers }) => ({
      wing,
      leader: wingMembers[0],
      groups: [{ members: wingMembers.slice(1) }],
    })),
  ];
}

function RolesSection() {
  const [selected, setSelected] = useState<RoleMember | null>(null);
  const branches = useMemo(buildBranches, []);

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
      <CommitteeTree branches={branches} onSelect={setSelected}></CommitteeTree>

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
