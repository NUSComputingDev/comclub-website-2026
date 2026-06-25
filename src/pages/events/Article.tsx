import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import articles from './articles.json';
import WindowCard from '../../layout/WindowCard';
import './Article.css';
import { parseArticles } from './zod';
import Linkify from '../../components/Linkify';

interface ArticleProps {
  title: string;
  body: string;
  imgSrc?: string;
}

const parsedArticles = Object.values(parseArticles(articles));

function Article() {
  const { articleLink } = useParams();
  const [content, setContent] = useState<ArticleProps>();

  useEffect(() => {
    setContent(parsedArticles.find((article) => article.link === articleLink));
  }, [articleLink]);

  return (
    <div className='article'>
      {
        content && <>
          <h1>{content.title}</h1>

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
