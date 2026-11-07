/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { SiGooglecalendar } from 'react-icons/si';
import articles from './articles.json';
import WindowCard from '../../layout/WindowCard';
import './Article.css';
//zod.ts already has the Article type containing dates, title and event link so just import it from there
import { parseArticles, type Article as EventArticle } from './zod';
import Linkify from '../../components/Linkify';
import { buildCalendarFile, buildGoogleCalendarUrl } from './EventCalendar';

const parsedArticles = Object.values(parseArticles(articles));
const calendarControlClassName = `inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3
  text-center text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-4 focus-visible:outline-primary`;

function Article() {
  const { articleLink } = useParams();
  const [content, setContent] = useState<EventArticle>();
  const googleCalendarUrl = content ? buildGoogleCalendarUrl(content, window.location.href) : null;

  useEffect(() => {
    setContent(parsedArticles.find((article) => article.link === articleLink));
  }, [articleLink]);
  //this builds calender text from an event, creates a Blob,
  //then creates a temp url that points to the blob,
  //and it clicks a temp download link, then removes it, after which it releases the temp url
  function handleCalendarDownload() {
    if (!content) return;

    const calendarText = buildCalendarFile(content, window.location.href);

    if (!calendarText) return;

    const file = new Blob([calendarText], {
      type: 'text/calendar;charset=utf-8',
    });

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = `${content.link}.ics`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 1000);
  }

  return (
    <div className='article'>
      {
        content && <>
          <h1>{content.title}</h1>
          {googleCalendarUrl && (
            <div className='flex max-w-full flex-wrap justify-center gap-3 px-8'>
              <button
                type='button'
                onClick={handleCalendarDownload}
                className={calendarControlClassName}
              >
                Add to calendar (.ics)
              </button>
              <a
                href={googleCalendarUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={calendarControlClassName}
              >
                <SiGooglecalendar aria-hidden='true' focusable='false' className='h-5 w-5 shrink-0' />
                Add to Google Calendar
                <span className='sr-only'> (opens in a new tab)</span>
              </a>
            </div>
          )}

          {/* { render only if there's an image } */}
          {
            content.imgSrc && <div className='article-img-container'>
              <WindowCard
                content={<img src={content.imgSrc}></img>}
              ></WindowCard>
            </div>
          }

          <section>
            <div className='whitespace-pre-wrap'><Linkify>{content.body}</Linkify></div>
          </section>

        </>
      }
      {
        !content && (
          <section>
            <div>Event details not found.</div>
          </section>
        )
      }
    </div>
  );
}

export default Article;
