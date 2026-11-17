import React, { useState } from 'react';
import {
  FaTelegramPlane,
  FaCalendarAlt,
  FaBookOpen,
  FaLaptopCode,
} from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';
import './index.css';
import ResourceLink from './ResourceLink';
import FolderLink from './FolderLink';

type Category = 'ALL' | 'CLUB' | 'ACADEMIC' | 'CAMPUS';

const PORTALS = [
  {
    label: 't.me/nuscomputingclub (Official Telegram)',
    link: 'https://t.me/nuscomputingclub',
    cat: 'CLUB' as const,
    icon: FaTelegramPlane,
  },
  {
    label: 'linktr.ee/nuscomputingclub (Club Links)',
    link: 'https://linktr.ee/nuscomputingclub',
    cat: 'CLUB' as const,
    icon: SiLinktree,
  },
  {
    label: 'nusmods.com (Timetable & Course Planner)',
    link: 'https://nusmods.com',
    cat: 'ACADEMIC' as const,
    icon: FaCalendarAlt,
  },
  {
    label: 'comp.nus.edu.sg/programmes (SoC Curriculum)',
    link: 'https://www.comp.nus.edu.sg/programmes/ug/',
    cat: 'ACADEMIC' as const,
    icon: FaBookOpen,
  },
  {
    label: 'canvas.nus.edu.sg (NUS Canvas LMS)',
    link: 'https://canvas.nus.edu.sg',
    cat: 'ACADEMIC' as const,
    icon: FaLaptopCode,
  },
];

const FOLDERS = [
  {
    label: 'Photos',
    link: 'https://www.flickr.com/photos/137141057@N04/albums/',
    cat: 'CLUB' as const,
  },
  {
    label: 'Maps',
    link: 'https://www.comp.nus.edu.sg/maps/venues/',
    cat: 'CAMPUS' as const,
  },
  {
    label: 'Merch',
    link: 'https://nusfastpay.nus.edu.sg/ccmerch/menu',
    cat: 'CLUB' as const,
  },
  {
    label: 'Feedback',
    link: 'https://feedback.nuscomputing.com/',
    cat: 'CAMPUS' as const,
  },
];

function getPillClass(isActive: boolean) {
  return isActive
    ? 'px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold border ' +
      'transition-all bg-[#002855] text-white border-[#002855] shadow-sm'
    : 'px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold border ' +
      'transition-all bg-white text-slate-700 border-slate-300 hover:bg-slate-100';
}

function Resources() {
  const [category, setCategory] = useState<Category>('ALL');
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();

  const filteredPortals = PORTALS.filter((item) => {
    const matchesCat = category === 'ALL' || item.cat === category;
    const matchesSearch = !q || item.label.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const filteredFolders = FOLDERS.filter((item) => {
    const matchesCat = category === 'ALL' || item.cat === category;
    const matchesSearch = !q || item.label.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const categories: { label: string; value: Category }[] = [
    { label: 'All Resources', value: 'ALL' },
    { label: 'Club & Socials', value: 'CLUB' },
    { label: 'Academics & Tools', value: 'ACADEMIC' },
    { label: 'Campus & Venues', value: 'CAMPUS' },
  ];

  return (
    <div className='resources'>
      <h1>Resources</h1>
      <p className='resources-subtitle'>
        Quick links to Computing Club channels, academic portals, campus venue
        maps, merchandise, and student feedback.
      </p>

      <div className='resources-toolbar'>
        <div className='resources-search'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Filter links (e.g. Telegram, Merch, Maps, NUSMods)...'
            aria-label='Filter resources'
          />
          {search && (
            <button
              type='button'
              onClick={() => setSearch('')}
              className='text-xs font-semibold text-slate-400 hover:text-slate-600'
            >
              Clear
            </button>
          )}
        </div>
        <div className='resources-pills'>
          {categories.map((cat) => (
            <button
              key={cat.value}
              type='button'
              aria-pressed={category === cat.value}
              onClick={() => setCategory(cat.value)}
              className={getPillClass(category === cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className='resources-content'>
        <div
          className={
            filteredFolders.length > 0
              ? 'resource-window-container'
              : 'flex flex-col gap-4 w-full max-w-2xl mx-auto'
          }
        >
          {filteredPortals.length > 0 ? (
            filteredPortals.map((portal) => (
              <ResourceLink
                key={portal.link}
                label={portal.label}
                link={portal.link}
                icon={portal.icon}
              />
            ))
          ) : (
            <p className='text-sm text-slate-500 py-4 text-center'>
              No portal links match your current filter.
            </p>
          )}
        </div>

        {filteredFolders.length > 0 && (
          <div className='resource-link-container'>
            <div className='grid grid-cols-2 gap-4 place-items-center'>
              {filteredFolders.map((folder) => (
                <FolderLink
                  key={folder.label}
                  label={folder.label}
                  link={folder.link}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
