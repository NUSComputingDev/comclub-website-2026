/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import articles from './articles.json';
import WindowCard from '../../layout/WindowCard';
import './Article.css';
//zod.ts already has the Article type containing dates, title and event link so just import it from there
import { parseArticles, type Article as EventArticle } from './zod';
import Linkify from '../../components/Linkify';
import { buildCalendarFile, getEventDates } from './EventCalendar';

const parsedArticles = Object.values(parseArticles(articles));

function Article() {
  const { articleLink } = useParams();
  const [content, setContent] = useState<EventArticle>();

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
          {getEventDates(content) && (
            <button
              type='button'
              onClick={handleCalendarDownload}
              className='rounded-lg bg-primary px-4 py-3 text-white
                hover:opacity-90 focus-visible:outline
                focus-visible:outline-2 focus-visible:outline-offset-4
                focus-visible:outline-primary'
            >
              Add to calendar (.ics)
            </button>
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
