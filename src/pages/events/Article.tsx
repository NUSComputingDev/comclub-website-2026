/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import articles from './articles.json';
import WindowCard from '../../layout/WindowCard';
import './Article.css';
//zod.ts already has the Article type containing dates, title and event link so just import it from there
import { parseArticles, type Article as EventArticle } from './zod';
import Linkify from '../../components/Linkify';
import CalendarActions from './CalendarActions';

const parsedArticles = Object.values(parseArticles(articles));

function Article() {
  const { articleLink } = useParams();
  const [content, setContent] = useState<EventArticle>();

  useEffect(() => {
    setContent(parsedArticles.find((article) => article.link === articleLink));
  }, [articleLink]);
  return (
    <div className='article'>
      {
        content && <>
          <h1>{content.title}</h1>
          <CalendarActions article={content} pageUrl={window.location.href} />

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
