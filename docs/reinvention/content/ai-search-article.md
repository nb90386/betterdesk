---
title: "How customers find a commercial cleaning company in Google and AI search (and what you can actually control)"
description: "A plain guide for cleaning owners: how Google and AI search pick businesses, what you control, what you can't, and a 30-minute self-check."
updated: 2026-11-07
author: "BetterDesk"
---

# How customers find a commercial cleaning company in Google and AI search (and what you can actually control)

A facilities manager needs a new night crew. Five years ago they typed a search, scanned ten blue links and called three companies. Today they might do the same thing. Or they might read an AI summary at the top of Google, ask Copilot, or ask ChatGPT for "commercial cleaners near our office."

This guide sticks to what Google, Microsoft, OpenAI and others have published. Where nobody outside those companies knows the answer, we say so.

## What changed

Search results now often include a written answer, not just links. Google has AI Overviews and AI Mode. Bing has AI summaries and Copilot. ChatGPT, Claude and Perplexity can search the web and cite pages in their replies.

For you, it means your website is sometimes read by software that summarizes it for someone else.

What did not change: these tools still have to find your site, read it, and decide it answers the question. That part is old-fashioned web work.

## How AI answers pick sources

### What is known

**Google.** Google's own guide on [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) is direct. To appear in AI Overviews or AI Mode, "a page must be indexed and eligible to be shown in Google Search with a snippet." It adds: "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."

Google says these features may use "query fan-out," "issuing multiple related searches across subtopics and data sources." One question can become several smaller searches.

Google's newer [guide to generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) sums it up: optimizing for AI search "is optimizing for the search experience, and thus still SEO."

**ChatGPT.** OpenAI's [crawler documentation](https://developers.openai.com/api/docs/bots) says its OAI-SearchBot "is used to surface websites in search results in ChatGPT's search features." Sites that block it "will not be shown in ChatGPT search answers."

**Perplexity and Claude.** Both publish similar crawler rules. Perplexity says, "To ensure your site appears in search results, we recommend allowing PerplexityBot" ([Perplexity crawlers](https://docs.perplexity.ai/guides/bots)). Anthropic says blocking Claude-SearchBot "may reduce your site's visibility and accuracy in user search results" ([Anthropic crawler help](https://support.claude.com/en/articles/8896518)).

### What is not known

None of these companies publishes how it chooses which businesses to name in a given answer. Nobody can promise you a spot in one. If someone does, ask where that promise comes from.

## The foundations that matter for all of it

The same basics help with Google, Bing and AI tools. None of them are new.

### 1. Let search engines read your site

If a crawler cannot fetch your pages, nothing else matters. Check that your main pages load without a login, are not marked `noindex`, and are not blocked in robots.txt. Google's [robots.txt guide](https://developers.google.com/search/docs/crawling-indexing/robots/intro) notes that robots.txt controls crawling, and that it "is not a mechanism for keeping a web page out of Google." Use `noindex` for that.

### 2. One clear page per service, and say where you work

Give each main service its own page. Say plainly who it is for, what is included, how often you clean, and which areas you serve.

Name the neighborhoods and suburbs you actually cover. Skip near-identical city pages for places you don't serve. Google's guide says it helps to have "a unique viewpoint that stands out." For a cleaner, that might be how you handle keys and alarm codes, or what happens when a client reports a miss.

### 3. Same name, address and phone everywhere

Use one business name, one phone number, and one address (or service area) on your website, your Google Business Profile, Bing Places, and directories. Mismatches make it harder for software to be sure two listings are the same company.

### 4. A complete Google Business Profile

Google's AI guide says "Google Business Profiles can help your products and services to be visible in both AI responses and other Google Search results."

Most commercial cleaners don't have customers visiting an office. Google's [business profile guidelines](https://support.google.com/business/answer/3038177) say: "If you're a service-area business, you should hide your business address from customers." Set a realistic service area. Google says it "shouldn't extend farther than about 2 hours of driving time." Use your real business name. "Including unnecessary information in your business name isn't permitted," so no "Best Office Cleaning Denver" in the name field.

### 5. Reviews you are allowed to show

Ask happy clients for Google reviews and answer them, good and bad. On your site, quote testimonials as text with the client's permission. One trap: adding star-rating markup for reviews of your own company. Google's [review snippet rules](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) say pages where the business "controls the reviews about itself" are "ineligible for star review feature."

### 6. Structured data that matches the page

Structured data is code that labels facts on a page, like your name and phone number. Google says it "isn't required for generative AI search" but is still worth using for rich results. The rule that matters: "Your structured data must be a true representation of the page content" ([structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)). If the page doesn't say you serve Aurora, the markup shouldn't either.

## robots.txt and AI crawlers

Your robots.txt file lives at `yourdomain.com/robots.txt` and tells crawlers what they may fetch. Website builders and security plugins sometimes add AI blocks without telling you.

The important thing to know: most AI companies run **separate** crawlers for search and for training. Blocking one does not block the other.

| Crawler | Company | What it's for | If you block it |
|---|---|---|---|
| OAI-SearchBot | OpenAI | ChatGPT search | Not shown in ChatGPT search answers |
| GPTBot | OpenAI | Model training | Content not used for training |
| Claude-SearchBot | Anthropic | Claude search | May reduce visibility in search results |
| ClaudeBot | Anthropic | Model training | Future content excluded from training |
| PerplexityBot | Perplexity | Perplexity search | Perplexity recommends allowing it to appear |
| Google-Extended | Google | Gemini training and grounding | No effect on Google Search inclusion or ranking |
| Applebot-Extended | Apple | Apple model training | Pages can still appear in Apple search |

Sources: [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518), [Perplexity](https://docs.perplexity.ai/guides/bots), [Google](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers), [Apple](https://support.apple.com/en-us/119829).

The OAI-SearchBot vs GPTBot split is the one owners get wrong most. If you don't want OpenAI training on your site, block GPTBot. If you still want to be eligible for ChatGPT search, leave OAI-SearchBot allowed. OpenAI says changes can take about 24 hours to apply.

Google also added a setting in Search Console that removes a site from AI Overviews and AI Mode ([Search generative AI control](https://support.google.com/webmasters/answer/16908024)). If you want to be eligible for those features, check that it isn't set to exclude your site.

### What about llms.txt?

llms.txt is a [proposed file](https://llmstxt.org/) meant to help AI tools read a site. It is a proposal, not an adopted standard. Google says files like this "will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them." We found no official statement from OpenAI, Anthropic, Perplexity, Microsoft or Apple saying their search uses it. It is fine to have one. Don't pay anyone to make one for search.

## What you can't control or measure

- **You can't control what an AI answer says.** You can only make your site clear, accurate and readable.
- **You can't see most AI answers.** There is no public list of every time ChatGPT or Claude mentioned your company.
- **Answers vary.** The same question can name different businesses on different days.
- **Some measurement does exist.** Google Search Console now has a [generative AI performance report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) showing how often your pages appeared in Google's AI features. Bing Webmaster Tools has an [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) showing citations in Copilot and Bing AI summaries. Bing notes these counts do not indicate "ranking, authority, or the role of any page within an individual answer." OpenAI says ChatGPT adds `utm_source=chatgpt.com` to links it sends, so those visits show up in your analytics.

Use those numbers. For any other "AI visibility score," ask how it was measured.

## A 30-minute self-check

1. **Search your company name in Google.** Does your Business Profile appear with the right phone, hours and service area?
2. **Open `yourdomain.com/robots.txt`.** Look for `Disallow: /` under `User-agent: *`, `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Bingbot` or `Googlebot`. Any of those blocks search.
3. **Open one service page in a private window.** Does it load without a login wall and say what the service is and where, in the first few lines?
4. **Compare name, address and phone** on your site footer, Google Business Profile and Bing Places. Fix any differences.
5. **Count your service pages.** Does each main service you sell have its own page?
6. **Check the areas listed on your site.** Do you really send crews there?
7. **Check your reviews.** When did you last get a new Google review? Have you answered the recent ones?
8. **Run Google's [Rich Results Test](https://search.google.com/test/rich-results)** on your home page. Does the markup match what the page shows?
9. **Open Google Search Console** (or set it up). Check the Performance report and the generative AI report. Confirm the Search generative AI control is not set to exclude you.
10. **Verify your site in Bing Webmaster Tools** and look at AI Performance once data appears.

## Worked example: Clearline Commercial Cleaning (fictional)

*Clearline Commercial Cleaning is a made-up company used to illustrate the checklist. It does not exist, and nothing here describes a real search result or AI answer.*

Clearline has eight crews cleaning offices, clinics and a few gyms across central and east Denver: Capitol Hill, Cherry Creek, Lowry, Stapleton (Central Park) and Aurora's western edge. A property manager might search "commercial cleaning company serving central Denver."

Here is what the owner finds in 30 minutes:

- **robots.txt** has `User-agent: GPTBot` / `Disallow: /`, added by a security plugin. That blocks OpenAI training only. OAI-SearchBot is allowed. The owner decides that's fine and leaves it. A second rule blocks `PerplexityBot`. They remove it.
- **Service pages.** The site has one "Services" page listing everything. They plan separate pages for office cleaning, medical office cleaning and floor care, each naming the neighborhoods they cover.
- **Areas.** The old site said "serving all of Colorado." They change it to the areas they actually clean.
- **Name and phone.** The Google profile uses an old phone number. They update it.
- **Business Profile.** The address was showing even though nobody visits the shop. They hide it and set a service area covering central and east Denver.
- **Structured data.** A theme had added five-star review markup for Clearline itself. They remove it, since Google won't show self-review stars anyway, and keep simple LocalBusiness markup with the real name, phone and URL.

None of this guarantees Clearline will be named in any AI answer. It means the next crawler to read the site finds a clear, accurate company that serves central Denver.

## Sources

- Google: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- Google: [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- Google: [Search generative AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- Google: [Search generative AI control](https://support.google.com/webmasters/answer/16908024)
- Google: [Common crawlers, including Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- Google: [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- Google: [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- Google: [Review snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- Google: [Guidelines for representing your business on Google](https://support.google.com/business/answer/3038177)
- Google: [Robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- Microsoft: [AI Performance in Bing Webmaster Tools](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- OpenAI: [Overview of OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- OpenAI: [Publishers and developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
- Anthropic: [Does Anthropic crawl data from the web?](https://support.claude.com/en/articles/8896518)
- Perplexity: [Perplexity crawlers](https://docs.perplexity.ai/guides/bots)
- Apple: [About Applebot](https://support.apple.com/en-us/119829)
- [llms.txt proposal](https://llmstxt.org/)
