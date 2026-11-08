import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react';
import { FaApple } from 'react-icons/fa';
import { FiCalendar, FiChevronDown, FiDownload } from 'react-icons/fi';
import { SiGooglecalendar, SiMicrosoftoutlook } from 'react-icons/si';
import type { Article } from './zod';
import { buildCalendarFile, buildGoogleCalendarUrl, buildOutlookCalendarUrl } from './EventCalendar';

interface CalendarActionsProps {
  article: Article;
  pageUrl: string;
}

const menuItemClassName = `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-900
  data-[focus]:bg-blue-50 data-[focus]:text-primary`;

function CalendarActions({ article, pageUrl }: CalendarActionsProps) {
  const googleCalendarUrl = buildGoogleCalendarUrl(article, pageUrl);
  const outlookCalendarUrl = buildOutlookCalendarUrl(article, pageUrl);

  if (!googleCalendarUrl || !outlookCalendarUrl) {
    return null;
  }

  const webCalendars = [
    { label: 'Google Calendar', href: googleCalendarUrl, Icon: SiGooglecalendar, iconClassName: 'text-blue-600' },
    { label: 'Outlook', href: outlookCalendarUrl, Icon: SiMicrosoftoutlook, iconClassName: 'text-blue-600' },
  ];
  const downloadCalendars = [
    { label: 'Apple Calendar (.ics)', Icon: FaApple },
    { label: 'Other calendars (.ics)', Icon: FiDownload },
  ];

  function handleCalendarDownload() {
    const calendarText = buildCalendarFile(article, pageUrl);

    if (!calendarText) return;

    const file = new Blob([calendarText], {
      type: 'text/calendar;charset=utf-8',
    });

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = `${article.link}.ics`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 1000);
  }

  return (
    <Menu as='div' className='max-w-full px-4'>
      <MenuButton
        type='button'
        className='group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-white
          hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4
          focus-visible:outline-primary'
      >
        <FiCalendar aria-hidden='true' focusable='false' className='h-5 w-5' />
        Add to calendar
        <FiChevronDown
          aria-hidden='true'
          focusable='false'
          className='h-4 w-4 transition-transform group-data-[open]:rotate-180 motion-reduce:transition-none'
        />
      </MenuButton>

      <MenuItems
        anchor='bottom'
        modal={false}
        className='z-50 max-h-[var(--anchor-max-height)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto
          rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl focus:outline-none
          [--anchor-gap:0.5rem] [--anchor-padding:1rem]'
      >
        {webCalendars.map(({ label, href, Icon, iconClassName }) => (
          <MenuItem key={label}>
            <a href={href} target='_blank' rel='noopener noreferrer' className={menuItemClassName}>
              <Icon aria-hidden='true' focusable='false' className={`h-6 w-6 shrink-0 ${iconClassName}`} />
              <span>
                <span className='block font-medium'>{label}</span>
                <span className='block text-sm text-gray-500'>Open prefilled event</span>
              </span>
              <span className='sr-only'> (opens in a new tab)</span>
            </a>
          </MenuItem>
        ))}

        <MenuSeparator className='my-1 h-px bg-gray-200' />

        {downloadCalendars.map(({ label, Icon }) => (
          <MenuItem key={label}>
            <button type='button' onClick={handleCalendarDownload} className={menuItemClassName}>
              <Icon aria-hidden='true' focusable='false' className='h-6 w-6 shrink-0 text-gray-700' />
              <span>
                <span className='block font-medium'>{label}</span>
                <span className='block text-sm text-gray-500'>Download calendar file</span>
              </span>
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

export default CalendarActions;
