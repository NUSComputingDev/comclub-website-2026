# comclub website: recruit edition

hi. if u are reading this, u applied for **club tech** and u found the readme. that was test zero and u passed. congrats, genuinely, most people skip readmes.

this repo is a practice copy of the real comp club website ([NUSComputingDev/comclub-website-2026](https://github.com/NUSComputingDev/comclub-website-2026)). same code, same stack, same years of history. if u join club tech, the real one is what u will be looking after, so this whole task is basically a first date with it.

**dates are coming soon**, they'll drop in the telegram group. don't let this eat ur exam prep. if it's taking more than an evening or two, stop, submit what u have, and tell us what u would do next.

---

## step 0: get it running

u need [git](https://git-scm.com/downloads) and [node.js](https://nodejs.org/) (the LTS version is fine).

```bash
git clone https://github.com/Jay-Jay-Tee/comclub-website-recruit.git
cd comclub-website-recruit
npm install
npm run dev
```

then open the link the terminal prints (usually `http://localhost:5173`). if something explodes, read the error before panicking. if it is still exploding, that might be ur first issue :)

it's react + vite + tailwind. if u have never seen react before, that's ok. poke around `src/`, change some text, watch it update. that is honestly most of the learning.

---

## pick ur level

start wherever u like. a really good beginner submission can beat a messy advanced one, so pick the level where u can do ur best work.

### beginner: file one good issue

1. get the site running locally (step 0)
2. click around everything. phone size too (devtools, toggle device toolbar). read some of the code
3. find something that is wrong, broken, confusing, missing or just bad
4. check the [issues on this repo](https://github.com/Jay-Jay-Tee/comclub-website-recruit/issues) to see if someone already reported it. if they did, add a comment with anything new u found instead of making a duplicate
5. open **one** issue **on this repo**
6. (bonus, totally optional) try fixing it urself: fork this repo, make the fix on a branch, and open a pr that links to ur issue

if ur issue or fix is genuinely good, we'll add it to the real comp club website, so ur work could end up on the actual site before u even join.

a good issue says:

- **what's wrong**, in one sentence
- **how to see it**: the steps, the page, the screen size or browser
- **what u expected** vs **what actually happens**
- a screenshot if it's visual
- (bonus) where in the code u think the problem lives, and why

write it in ur own words. "improve ui" is not an issue, it's a horoscope.

### intermediate: build something small

beginners can already fix bugs, so here u add something new to the site.

1. pick one small feature or improvement the site doesn't have yet. some ideas: search or filters on the articles page, a proper 404 page, loading states, an accessibility pass (keyboard navigation, alt text, colour contrast), or ur own idea. if it's ur own idea, open an issue for it first so we can see what u're planning
2. fork **this** repo, make a branch, build it
3. open a pr **to this repo** (not the real one, we don't want 40 recruitment prs landing on the live site)
4. leave one helpful review on someone else's recruitment pr. what's good, what's confusing, what u'd change. reading other people's code is half of club tech

a good pr says what u built, why, how u tested it, and has before/after screenshots. small and finished beats big and half-done.

if ur pr is genuinely good, we'll add it to the real site, so ur code is live before u even join.

### advanced (optional): pick one lane

pick the one u would actually want to do all year. one lane, done properly.

**frontend.** build or rebuild a real page or component properly. responsive, accessible, consistent with the rest of the site. tell us in the pr what was wrong with the old one.

**backend.** the site has no backend. everything is static, and content lives in json files in the repo. give it one. for example: put the articles behind a small api so someone on the mc can post something without touching code. any stack. in ur pr, add a short note covering:
- what u built and why this design
- where it would be hosted and roughly what it would cost (free tiers count)
- what breaks first if 2000 freshies hit it at once

a working small thing plus a clear note beats an ambitious thing that only runs on ur laptop.

**ui.** redesign one page, in figma or whatever tool u like. send a link plus a short note: what was wrong before, what u changed, and which parts would be easy vs painful to actually build.

---

## the rules

- **ai is allowed**, but not 100% ai with u as the copy-paste button. at the end of ur pr or submission, add a few lines called **"how i used ai"**: which tools, for what, and one thing it got wrong that u fixed. "didn't use any" is also fine. in the chat we will ask u to explain ur code, so be honest
- **be nice to the repo.** one issue each, no spam, check for duplicates
- **never push secrets.** no api keys, tokens or passwords. if u do it by accident, tell us
- **solo**, but asking friends for help is fine, just mention it
- **stuck?** dm josh on telegram, @jayjaytee_07. a good question counts in ur favour

## submitting

fill in the submission form with ur level and ur links (issue / pr / figma). submit again if u update something, we take the latest one.

if ur submission catches our eye, we will grab u for a chill 15 min chat. u walk us through what u did, and we ask u to change one small thing live. that's it.

good luck. may ur `npm install` finish on the first try.
