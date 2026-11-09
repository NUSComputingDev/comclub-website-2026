import React, { useEffect, useRef, useState } from 'react';
import RoleCard, { RoleMember } from './RoleCard';
import './CommitteeTree.css';

export interface TreeGroup {
  label?: string;
  members: RoleMember[];
}

export interface WingBranch {
  wing: string;
  subtitle?: string;
  featured?: boolean;
  leader?: RoleMember;
  head?: RoleMember;
  groups: TreeGroup[];
}

interface CommitteeTreeProps {
  branches: WingBranch[];
  onSelect: (member: RoleMember) => void;
}

/**
 * Reveals the tree once it scrolls into view. Falls back to visible when
 * IntersectionObserver isn't available so the tree is never blank.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}

interface TreeBranchProps {
  branch: WingBranch;
  onSelect: (member: RoleMember) => void;
}

function TreeBranch({ branch, onSelect }: TreeBranchProps) {
  const count = branch.groups.reduce(
    (total, group) => total + group.members.length,
    branch.head ? 1 : 0,
  );

  const content = (
    <>
      {
        branch.head && (
          <ul className='tree-head'>
            <RoleCard member={branch.head} onSelect={onSelect}></RoleCard>
          </ul>
        )
      }
      {
        branch.groups.map((group, index) => (
          group.members.length > 0 && (
            <div className='tree-group' key={group.label ?? index}>
              {
                group.label && (
                  <span className='tree-group-label'>{group.label}</span>
                )
              }
              <ul className='tree-leaves'>
                {
                  group.members.map((member) => (
                    <RoleCard
                      key={member.name}
                      member={member}
                      onSelect={onSelect}
                    ></RoleCard>
                  ))
                }
              </ul>
            </div>
          )
        ))
      }
    </>
  );

  if (branch.featured) {
    return (
      <div
        className='tree-branch featured scroll-mt-24'
        id='wing-presidential'
        role='group'
        aria-label={branch.wing}
      >
        <div className='tree-window-bar'>
          <span className='tree-window-dots' aria-hidden='true'>
            <span className='bg-[#ff605c]'></span>
            <span className='bg-[#ffbd44]'></span>
            <span className='bg-[#00ca4e]'></span>
          </span>
          <span className='tree-window-title'>{branch.wing}</span>
          {
            branch.subtitle && (
              <span className='tree-window-subtitle'>{branch.subtitle}</span>
            )
          }
          <span className='tree-window-count'>{count}</span>
        </div>
        <div className='tree-window-body'>{content}</div>
      </div>
    );
  }

  const wingId = branch.wing.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div
      className='tree-branch scroll-mt-24'
      id={`wing-${wingId}`}
      role='group'
      aria-label={branch.wing}
    >
      <div className={`tree-label${branch.leader ? ' has-leader' : ''}`}>
        {
          branch.leader && (
            <img
              className='tree-leader-avatar'
              src={branch.leader.imgSrc}
              alt=''
              aria-hidden='true'
            />
          )
        }
        <span className='tree-label-text'>
          <span className='tree-label-top'>
            <span className='tree-label-name'>{branch.wing}</span>
            <span className='tree-label-count'>{count}</span>
          </span>
          {
            branch.leader && (
              <span className='tree-leader-name'>
                led by {branch.leader.shortName ?? branch.leader.name}
              </span>
            )
          }
        </span>
      </div>
      {content}
    </div>
  );
}

function CommitteeTree({ branches, onSelect }: CommitteeTreeProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [featured, ...wings] = branches;

  return (
    <div
      ref={ref}
      className={`committee-tree${inView ? ' is-visible' : ''}`}
    >
      {
        featured && (
          <TreeBranch branch={featured} onSelect={onSelect}></TreeBranch>
        )
      }
      <div className='tree-wings'>
        {
          wings.map((branch) => (
            <TreeBranch
              key={branch.wing}
              branch={branch}
              onSelect={onSelect}
            ></TreeBranch>
          ))
        }
      </div>
    </div>
  );
}

export default CommitteeTree;
