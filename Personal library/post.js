/* ==========================================================================
   Personal Knowledge Library — posts.js  (your blog's content)

   HOW TO ADD A POST
   Option A (easiest): open write.html in your browser, write the post, click
     "Download posts.js" and replace this file with the download.
   Option B (by hand): copy a post object below, give it a new unique id and
     fill in the fields. Put a comma between posts.

   HOW TO REMOVE A POST
   Delete its whole { ... } object (and the comma that goes with it), or set
   draft: true to hide it without deleting. You can also do this in write.html.

   FIELDS
   id        unique, lowercase letters/numbers/hyphens (becomes post.html?id=...)
   title     post title
   excerpt   one or two sentences shown on cards
   category  must match a category name in script.js
   date      YYYY-MM-DD
   cover     path to an image in assets/blog/ (or '' for a plain cover)
   coverAlt  describes the cover image for screen readers
   tags      array of keywords (used by search)
   featured  true to feature the post at the top of the blog page
   draft     true to hide the post from the site
   content   the post text, written in simple Markdown (see README):
             ## Heading, ### Sub-heading, **bold**, *italic*, [link](url),
             - bullet lists, 1. numbered lists, > quotes, --- divider
             Do not type a backtick (`) or the characters ${ inside content.
   ========================================================================== */

const BLOG_AUTHOR = 'Your Name';

const POSTS = [
  {
    id: 'learn-faster-feynman-technique',
    title: 'Learn Faster With the Feynman Technique',
    excerpt: 'If you cannot explain an idea simply, you do not understand it yet. Here is a four-step method for finding the gaps in your knowledge and closing them.',
    category: 'Psychology',
    date: '2026-10-27',
    cover: 'assets/blog/learn-faster-feynman-technique.svg',
    coverAlt: 'Abstract network of connected points, representing ideas linking together',
    tags: ['learning', 'study skills', 'memory', 'teaching'],
    featured: true,
    draft: false,
    content: `Most of us confuse **recognising** an idea with **understanding** it. We read a chapter, nod along, and feel that we have learned it. Then someone asks us to explain it and the feeling vanishes. The Feynman technique, named after the physicist Richard Feynman, is a simple way to expose that gap before it embarrasses you in an exam or a meeting.

## The four steps

1. **Pick one concept.** Write its name at the top of a blank page. Keep it narrow: "compound interest" rather than "finance".
2. **Explain it as if to a twelve-year-old.** Use plain words and short sentences. No jargon you cannot define on the spot.
3. **Find the gaps.** Wherever you stumble, hand-wave or reach for a technical term, you have found something you do not yet understand. Mark it.
4. **Go back and simplify.** Return to your source, study only those gaps, then rewrite the explanation more clearly. Repeat until it flows.

## Why it works

Explaining forces you to retrieve information from memory instead of simply re-reading it, and retrieval is one of the most reliable ways to strengthen learning. Plain language also removes the places where vague understanding can hide.

> If you cannot explain it simply, you probably have not understood it well enough.

## Making it a habit

- Explain out loud to a friend, a mirror or an empty room. Speaking is harder than thinking, which is the point.
- Use analogies. Comparing a new idea to something familiar shows whether the structure really makes sense.
- Keep a small notebook of the gaps you find. It becomes a personal list of what to study next.
- Come back to the same concept a week later and explain it again from scratch.

## A small warning

The technique works best for ideas with clear logic, such as science, mathematics, economics and technology. For pure memorisation, such as vocabulary or dates, pair it with spaced repetition. And be kind to yourself: finding a gap is not failure, it is the whole purpose of the exercise.

Try it today with one idea you believe you already know. You may be surprised how much there is left to learn.`
  },
  {
    id: 'reading-slowly-in-a-fast-world',
    title: 'Reading Slowly in a Fast World',
    excerpt: 'Skimming has its place, but deep understanding needs time. A few simple practices for reading less, remembering more and actually enjoying it.',
    category: 'Research/Education',
    date: '2026-10-20',
    cover: 'assets/blog/reading-slowly-in-a-fast-world.svg',
    coverAlt: 'Abstract illustration of an open book beside a magnifying glass',
    tags: ['reading', 'focus', 'study skills', 'attention'],
    featured: false,
    draft: false,
    content: `We have never had more to read, or less patience for reading. Headlines, feeds and notifications train us to skim, and skimming is a perfectly good skill for finding things. But it is not the same skill as understanding them.

## Two kinds of reading

**Scanning** is for locating information: a date, a name, a price. **Deep reading** is for following an argument, noticing how it is built and deciding whether you agree. Problems begin when we scan something that deserved to be read.

## Practices that help

- **Choose less.** Decide in advance what is worth your full attention this week. One good book beats five half-finished ones.
- **Protect a window.** Even twenty minutes with the phone in another room changes the quality of reading.
- **Read with a pencil.** Underline sparingly and write short margin notes: "why?", "example", "disagree".
- **Pause at the end of each section.** Close your eyes and recall the main point in one sentence. If you cannot, re-read.
- **Write three lines afterwards.** What was the claim, what was the evidence, and what do you still doubt?

## Slow does not mean passive

Slow reading is active. You ask questions, test claims against what you already know, and sometimes stop to look something up. The aim is not speed or volume but understanding that is still there a month later.

## When to speed up

Not everything deserves depth. Reference material, routine updates and books that are not holding your attention can be skimmed or put down without guilt. Giving yourself permission to quit makes room for the things worth savouring.

> The goal of reading is not to have read, but to have changed how you think.

Start small: pick one article or chapter this week and read it slowly, from start to finish, with nothing else open.`
  },
  {
    id: 'gentle-roadmap-into-cloud-computing',
    title: 'A Gentle Roadmap Into Cloud Computing',
    excerpt: 'New to the cloud and not sure where to start? A step-by-step learning path from the basics to a first small project and a first certification.',
    category: 'Technology',
    date: '2026-10-13',
    cover: 'assets/blog/gentle-roadmap-into-cloud-computing.svg',
    coverAlt: 'Abstract microchip with glowing circuit traces, representing cloud technology',
    tags: ['cloud', 'azure', 'careers', 'beginners'],
    featured: false,
    draft: false,
    content: `The cloud can look enormous from the outside: hundreds of services, endless acronyms and a new feature every week. The good news is that you do not need to learn it all. You need a path, and the patience to follow it one step at a time.

## Step 1: Learn the vocabulary

Start with the core ideas that every provider shares:

- **Compute:** virtual machines, containers and serverless functions.
- **Storage:** files, databases and backups.
- **Networking:** how services find and talk to each other safely.
- **Identity:** who is allowed to do what.
- **Cost:** what you are paying for, and how to keep it under control.

## Step 2: Pick one provider

Concepts transfer between providers, so choose one and go deeper rather than sampling all three. Microsoft Azure, Amazon Web Services and Google Cloud are all good choices. Consider what your target employers or country's market tends to use.

## Step 3: Use a free account

Reading is not enough. Create a free-tier or trial account, set a **budget alert** immediately, and build something small, such as a static website, a storage account or a simple virtual machine. Then delete it so you do not pay for what you forgot.

## Step 4: Learn some command line and scripting

Being comfortable in a terminal and with a scripting language such as Python or PowerShell makes everything easier, especially automation.

## Step 5: Add a foundation certification

An entry-level certificate, such as Microsoft AZ-900 or AWS Cloud Practitioner, gives your study a clear structure and a visible milestone. Treat it as a map, not a finish line.

## Step 6: Build and document

Create two or three small projects and write about what you learned. A public record of real work often says more than a list of courses.

> You do not have to be an expert to begin. You have to begin to become one.

Keep security in mind from the first day: use strong sign-in protection, give each person and service only the access they need, and never put secret keys in public code.`
  },
  {
    id: 'write-to-think',
    title: 'Write to Think: Why a Notebook Beats a Busy Mind',
    excerpt: 'Writing is not only for recording thoughts. It is how we find them. A simple daily notebook habit that brings clarity to decisions and ideas.',
    category: 'Personal Development',
    date: '2026-10-06',
    cover: 'assets/blog/write-to-think.svg',
    coverAlt: 'Abstract ascending steps leading toward a rising sun',
    tags: ['writing', 'journaling', 'clarity', 'habits'],
    featured: false,
    draft: false,
    content: `A busy mind feels productive, but it often just circles. The same worry, the same half-formed plan, the same unfinished argument, round and round. Writing breaks the loop, because a sentence on paper has to start somewhere and end somewhere.

## Why writing clarifies

Thoughts in our head are loose and flexible, which makes it easy to avoid noticing contradictions. Once written down, they hold still. You can see what you actually believe, where your reasoning jumps and what you have been avoiding.

## A ten-minute notebook habit

1. **Choose a quiet time.** Morning or evening, the same time each day.
2. **Start with one prompt.** For example: "What is on my mind?", "What did I learn today?" or "What decision am I putting off?"
3. **Write without editing** for ten minutes. Spelling and style do not matter.
4. **End with one line:** the next small action you will take.

## Prompts worth keeping

- What went well today, and why?
- What did I find difficult, and what could I try differently?
- What am I grateful for right now?
- What would I advise a friend in my situation?

## Using writing for decisions

When facing a choice, write two columns: what you know and what you are assuming. Then write the strongest argument for each option, even the one you lean against. Surprisingly often, the right choice becomes obvious by the time the page is full.

> I write to find out what I think.

## Keep it private and forgiving

Your notebook is not a performance. Nobody needs to read it. If you miss a few days, simply continue from where you are. A messy notebook that is used is far better than a beautiful one that is not.

Try it for one week and notice whether your head feels lighter at the end.`
  },
  {
    id: 'five-questions-before-you-believe',
    title: 'Five Questions to Ask Before You Believe a Claim',
    excerpt: 'In a world of confident headlines and viral posts, a short checklist helps you separate solid claims from persuasive noise without becoming a cynic.',
    category: 'Critical Thinking',
    date: '2026-09-29',
    cover: 'assets/blog/five-questions-before-you-believe.svg',
    coverAlt: 'Abstract balanced scales weighing two ideas',
    tags: ['critical thinking', 'evidence', 'media literacy', 'reasoning'],
    featured: false,
    draft: false,
    content: `Every day we meet claims that want to be believed: in the news, in advertisements, from friends and from strangers online. We cannot investigate all of them, but we can build a habit of asking a few good questions before we accept or share one.

## The five questions

1. **Who is saying this, and how do they know?** Look for firsthand knowledge, expertise or clear evidence, not just confidence.
2. **What is the evidence?** Is it data, a study, an example or only an opinion? How much of it is there?
3. **What else could explain it?** Many claims confuse two things happening together with one causing the other.
4. **What is missing?** Notice what is left out: the sample size, the other side, the context or the time period.
5. **Who gains if I believe it?** This does not make a claim false, but it tells you where to look more carefully.

## Be wary of strong feelings

Claims that make us angry, afraid or very pleased are the ones most likely to be shared before they are checked. A sudden strong reaction is a good cue to slow down for a moment.

## Check before you share

- Search for the claim and see whether reliable sources report it.
- Look at the date. Old stories often resurface as if they were new.
- Follow the link back to the original source rather than trusting a screenshot.

## Stay open, not cynical

The aim is not to doubt everything. It is to match your confidence to the strength of the evidence, and to be willing to change your mind when better evidence arrives.

> Strong claims need strong evidence, and honest people are happy to be checked.

Next time something surprising crosses your screen, take thirty seconds and ask these five questions. It is a small habit with a large payoff.`
  },
  {
    id: 'gratitude-a-practice-not-a-mood',
    title: 'Gratitude: A Practice, Not a Mood',
    excerpt: 'We often wait to feel thankful. A gentler approach is to practise gratitude on purpose, in small ways that quietly reshape how we see ordinary days.',
    category: 'Faith',
    date: '2026-09-22',
    cover: 'assets/blog/gratitude-a-practice-not-a-mood.svg',
    coverAlt: 'Abstract light rays streaming through an archway',
    tags: ['gratitude', 'reflection', 'daily practice', 'wellbeing'],
    featured: false,
    draft: false,
    content: `Many of us treat gratitude as a mood that arrives on its own: a good day, a gift, a piece of good news. Yet the people who seem most thankful are rarely those with the easiest lives. They have simply made gratitude a practice, something they do rather than something they wait to feel.

## Why practise it

Paying attention to what is good does not deny what is hard. It widens the picture. Over time, small acts of thanks train the mind to notice generosity, beauty and help that were there all along. Many faith traditions have long taught this: give thanks in all circumstances, not only for all circumstances.

## Simple ways to begin

- **Name three things each evening.** Be specific: "the neighbour who greeted me", not just "my neighbours".
- **Say thank you in person.** A short, sincere sentence to someone who helped you can brighten two days at once.
- **Write one thank-you note a month.** A few honest lines to a teacher, relative or friend can mean more than you expect.
- **Pause before meals.** Take a moment to think of the many people and effort behind the food.
- **Thank in the hard season too.** Even on difficult days, look for one small mercy.

## Gratitude and generosity

Thankfulness tends to grow into giving. Having noticed how much we have received, we feel freer to share our time, attention and resources with others.

## What it is not

Gratitude is not pretending to be happy or ignoring real pain. It sits comfortably alongside sorrow and honest struggle. It is simply a way of keeping the good in view.

> Gratitude turns what we have into enough.

Tonight, before you sleep, name three things from the day. Do the same tomorrow, and see what changes.

*This reflection is offered in a spirit of encouragement and is not tied to a single tradition.*`
  }
];