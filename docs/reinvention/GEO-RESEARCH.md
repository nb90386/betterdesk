# GEO research: official sources for Presence and our marketing copy

Accessed: 2026-11-07 (all sources below unless noted).
Purpose: ground BetterDesk's "Presence" audit and any AI-search copy in what Google, Microsoft, OpenAI, Anthropic, Perplexity and Apple actually publish. Where a page could not be read directly, that is stated.

Method note: pages were read with a web fetcher that returns page text. Quotes below are short verbatim fragments as returned. Two sources (OpenAI Publishers FAQ, Bing Webmaster help pages) could not be fetched directly; their status is marked in each entry. Re-check any quote before it goes on a public page.

---

## 1. Google: AI features and your website

- URL: https://developers.google.com/search/docs/appearance/ai-features
- Accessed: 2026-11-07
- Quotes:
  - "a page must be indexed and eligible to be shown in Google Search with a snippet"
  - "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."
  - "You don't need to create new machine readable files, AI text files, or markup to appear in these features."
  - "There's also no special schema.org structured data that you need to add."
  - AI Overviews and AI Mode "may use a "query fan-out" technique", described as "issuing multiple related searches across subtopics and data sources."
  - "sites appearing in AI features (such as AI Overviews and AI Mode) are included in the overall search traffic in Search Console."
- What this means for a cleaning company: If Google can index your service pages and show a normal snippet from them, you are already eligible for AI Overviews and AI Mode. There is no special AI file or tag to buy or install.

## 2. Google: Optimizing your website for generative AI features on Google Search

- URL: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Accessed: 2026-11-07
- Status: **The page exists.** Title: "Optimizing your website for generative AI features on Google Search." No "last updated" date was visible to our fetcher.
- Quotes:
  - "optimizing for generative AI search is optimizing for the search experience, and thus still SEO."
  - "You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search"
  - "Doing so will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them." (said of LLMS.txt and similar files; the Next steps section warns against "creating unnecessary AI text files (like llms.txt)")
  - "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."
  - "There's no requirement to break your content into tiny pieces for AI to better understand it."
  - "Google Business Profiles can help your products and services to be visible in both AI responses and other Google Search results."
  - "Our AI systems take a look at a variety of sources, so it can be helpful to have a unique viewpoint that stands out."
- What this means for a cleaning company: Google treats "AI search optimization" as ordinary SEO. A complete Business Profile and genuinely specific pages (your actual services, your actual area, how you actually work) matter more than any AI-specific trick.

## 3. Google Search Central blog: Search Generative AI performance reports (Search Console)

- URL: https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- Published: 2026-06-03. Accessed: 2026-11-07
- Quotes:
  - Impressions are defined as "How often URLs from your site appeared in generative AI features in Search and Discover."
  - Covers features "such as AI Overviews and AI Mode, as well as generative AI features in Discover."
  - "This data is included in the overall performance report, where it will continue to be tracked."
- Notes: the post reports impressions; our fetcher found no mention of clicks or query data in this report. A note on the post says the insights reached all websites by 2026-08-31.
- What this means for a cleaning company: Google Search Console now shows how often your pages appeared in Google's AI features. It is the only first-party Google number for this; use it rather than guessing.

## 4. Google Search Console Help: Search generative AI control

- URL: https://support.google.com/webmasters/answer/16908024?hl=en
- Accessed: 2026-11-07
- Quotes:
  - Controls "your site's inclusion in the following generative AI features on Google Search." (AI Overviews, AI Mode, generative AI features in Discover)
  - It "doesn't affect AI training"
  - "this control isn't used as a ranking or inclusion signal affecting other parts of Search."
  - Changes take "a few days"; content excluded "within 1-2 days after the control goes live"
- Notes: rolled out to all websites worldwide as of 2026-08-31 (per the page). Excluded sites get no traffic or impressions from those features.
- What this means for a cleaning company: Opting out of Google's AI features is now a setting in Search Console. Most local service companies will want to stay in. Presence should check that nobody switched it off by mistake (we cannot read this setting without Search Console access; ask the owner).

## 5. Google: common crawlers (Google-Extended)

- URL: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- Accessed: 2026-11-07
- Quotes:
  - "Google-Extended is a standalone product token" used to "manage whether content Google crawls from their sites may be used for training future generations of Gemini models." (also covers grounding in Gemini Apps and Vertex AI)
  - "Google-Extended does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search."
  - Google-Extended "doesn't have a separate HTTP request user agent string" and "is used in a control capacity."
  - "Google intends to support the AIPREF shared machine-readable training preference signal" ... "in early 2027."
- Related: Search Central blog, 2026-10-30, https://developers.google.com/search/blog/2026/10/ai-training-control : "Today, we're announcing our plans to support a shared AI training control in robots.txt." ... "We aim to support this new control along with other AI providers in 2027." If the shared token opts out of training and Google-Extended is not named, "Google plans to interpret that as if the publisher had disallowed" Google-Extended.
- What this means for a cleaning company: Blocking Google-Extended does not remove you from Google Search or AI Overviews. It is a training/Gemini control, not a visibility control.

## 6. Google: General structured data guidelines

- URL: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Accessed: 2026-11-07
- Quotes:
  - "Your structured data must be a true representation of the page content."
  - Listed as a problem: "The structured data is not representative of the main content of the page, or is potentially misleading."
  - "Don't use structured data to deceive or mislead users."
  - "Google does not guarantee that your structured data will show up in search results,"
- What this means for a cleaning company: Markup must describe what the page visibly says. Do not add services, cities, ratings or hours in markup that the page itself does not show.

## 7. Google: LocalBusiness structured data

- URL: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Accessed: 2026-11-07
- Quotes:
  - Can "tell Google about business hours, different departments within a business"
  - Required `address`: "The physical location of the business." Required `name`: "The name of the business."
  - Recommended `telephone`: "A business phone number meant to be the primary contact method for customers."
  - `aggregateRating` and `review`: "This property is only recommended for sites that capture reviews about other local businesses."
- Notes: the page does not mention `areaServed` or service-area businesses (verified absent by our fetcher). `areaServed` is a schema.org property; Google does not document it on this page, so we must not claim Google uses it.
- What this means for a cleaning company: LocalBusiness markup with your real name, address and phone is reasonable. Do not mark up star ratings of your own company on your own site expecting stars.

## 8. Google: Review snippet structured data (self-serving reviews)

- URL: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Accessed: 2026-11-07
- Quote:
  - "If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature."
- What this means for a cleaning company: Testimonials on your own site are fine to show as text, but marking them up will not earn star ratings in Google. Your Google reviews live on your Business Profile.

## 9. Google Business Profile: Guidelines for representing your business on Google

- URL: https://support.google.com/business/answer/3038177
- Accessed: 2026-11-07
- Quotes:
  - "If you're a service-area business, you should hide your business address from customers."
  - Service-area businesses "should have one profile for the central office or location with a designated service area"
  - The service area "shouldn't extend farther than about 2 hours of driving time"
  - "Including unnecessary information in your business name isn't permitted"
- What this means for a cleaning company: Most commercial cleaners are service-area businesses. Hide the address if customers don't visit you, set a realistic service area, and use your real business name without added keywords like "Best Office Cleaning Denver."

## 10. Google: Robots.txt introduction

- URL: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Accessed: 2026-11-07
- Quotes:
  - "A robots.txt file tells search engine crawlers which URLs the crawler can access on your site."
  - "it is not a mechanism for keeping a web page out of Google." (use `noindex` instead)
  - "we might still find and index a disallowed URL if it is linked from other places on the web."
- What this means for a cleaning company: robots.txt controls crawling, not indexing. A single wrong line can stop crawlers reading your service pages.

## 11. OpenAI: Overview of OpenAI Crawlers

- URL: https://developers.openai.com/api/docs/bots
- Accessed: 2026-11-07
- Quotes:
  - "OAI-SearchBot is for search." It "is used to surface websites in search results in ChatGPT's search features."
  - "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers" (they "can still appear as navigational links")
  - "it can take ~24 hours from a site's robots.txt update for our systems to adjust."
  - "GPTBot is used to make our generative AI foundation models more useful and safe." "Disallowing GPTBot indicates a site's content should not be used in training generative AI foundation models."
  - "ChatGPT-User is not used for crawling the web in an automatic fashion." "Because these actions are initiated by a user, robots.txt rules may not apply." "ChatGPT-User is not used to determine whether content may appear in Search."
  - "OAI-AdsBot only visits pages submitted as ads."
- What this means for a cleaning company: To be eligible for ChatGPT search answers, do not block OAI-SearchBot. Blocking GPTBot is a separate training choice and, per OpenAI, does not decide search inclusion.

## 12. OpenAI: Publishers and Developers FAQ

- URL: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- Accessed: 2026-11-07
- Status: **Could not fetch directly (HTTP 403 to our fetcher).** The quotes below are from the official page's text as indexed by a search engine (including a text-fragment link on help.openai.com). Treat as likely verbatim; re-verify in a browser before public use.
  - "ChatGPT automatically includes the UTM parameter utm_source=chatgpt.com in referral URLs, enabling clear tracking and analysis of inbound traffic from ChatGPT search results"
  - On noindex: "in order for our crawler to read a meta tag, it must be allowed to crawl the relevant page(s)."
  - Index summaries (not verbatim): any public website can appear in ChatGPT search; to be included in summaries and snippets, do not block OAI-SearchBot; to exclude content from training, block GPTBot.
- What this means for a cleaning company: You can see ChatGPT referrals in your analytics by looking for `utm_source=chatgpt.com`. Nothing in OpenAI's material describes a way to pay for or guarantee a place in an answer.

## 13. Microsoft Bing: AI Performance in Bing Webmaster Tools

- URLs: help page https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c (**could not be read: the page renders client-side and our fetcher received only the title**). Official equivalent read instead: https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview (published 2026-02-10).
- Accessed: 2026-11-07
- Quotes (from the blog post):
  - Covers "Microsoft Copilot, AI-generated summaries in Bing, and select partner integrations."
  - Total Citations: "the total number of citations that are displayed as sources in AI-generated answers" ... "without indicating placement or presentation within a specific answer."
  - Average Cited Pages "does not indicate ranking, authority, or the role of any page within an individual answer."
  - Grounding queries: "the key phrases the AI used when retrieving content"; "The data shown represents a sample of overall citation activity."
- Follow-up (not read in full): June 2026 post adding Intents, Topics, Citation Share and Compare in preview: https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare
- What it measures: citations (being shown as a source) in Microsoft's AI answers, cited pages, and sampled grounding queries. It does not measure ChatGPT, Google or Perplexity, and a citation is not a click.
- What this means for a cleaning company: If you verify your site in Bing Webmaster Tools, you can see when Copilot or Bing's AI summaries cite your pages. That is real first-party data for one AI channel.
- Unverified: search summaries report that Bing is replacing NOARCHIVE/NOCACHE with new "AI Training" and "AI Grounding" preferences from 2027 (https://www.bing.com/webmasters/help/new-ai-preferences-2t1cc16d). We could not read that page. Do not build Presence checks on it until verified.

## 14. Anthropic: ClaudeBot, Claude-User, Claude-SearchBot

- URL: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Accessed: 2026-11-07
- Quotes:
  - "When a site restricts ClaudeBot access, it signals that the site's future materials should be excluded from our AI model training datasets."
  - "Disabling Claude-User on your site prevents our system from retrieving your content in response to a user query, which may reduce your site's visibility for user-directed web search."
  - "Claude-SearchBot navigates the web to improve search result quality for users."
  - "Disabling Claude-SearchBot on your site prevents our system from indexing your content for search optimization, which may reduce your site's visibility and accuracy in user search results."
  - Anthropic's bots "respect "do not crawl" signals by honoring industry standard directives in robots.txt."
- What this means for a cleaning company: Same pattern as OpenAI. Blocking the training crawler (ClaudeBot) is a separate choice from blocking the search crawler (Claude-SearchBot).

## 15. Perplexity: Perplexity Crawlers

- URL: https://docs.perplexity.ai/guides/bots
- Accessed: 2026-11-07
- Quotes:
  - "`PerplexityBot` is designed to surface and link websites in search results on Perplexity."
  - It "is not used to crawl content for AI foundation models."
  - "To ensure your site appears in search results, we recommend allowing `PerplexityBot`."
  - "Since a user requested the fetch, this fetcher generally ignores robots.txt rules." (Perplexity-User)
- What this means for a cleaning company: If PerplexityBot is blocked, Perplexity says you should not expect to show up in its results.

## 16. Apple: About Applebot

- URL: https://support.apple.com/en-us/119829
- Accessed: 2026-11-07
- Quotes:
  - Data is used for "the search technology integrated into many user experiences" in "Spotlight, Siri, and Safari."
  - Publishers can "choose to opt out of their website content being used to train Apple's general purpose foundation models." (Applebot-Extended)
  - "Applebot-Extended does not crawl webpages."
  - "Webpages that disallow Applebot-Extended can still be included in search results."
- What this means for a cleaning company: Blocking Applebot hurts Siri/Spotlight/Safari suggestions. Blocking Applebot-Extended only affects Apple model training.

## 17. llms.txt status

- Proposal page: https://llmstxt.org/ (accessed 2026-11-07). Describes itself as "A proposal to standardise on using an `/llms.txt` file to provide information to help agents use a website." Proposed by Jeremy Howard; first published 2024-09-03. It is a community proposal, not a ratified standard.
- Google (primary, verified): the AI optimization guide (source 2) names llms.txt as an "unnecessary AI text file" for Google Search and says such files "will neither harm nor help" because "Google Search ignores them."
- Google (secondary, not verified at source): press reports attribute statements to John Mueller (Bluesky, 2025: "no AI system currently uses llms.txt") and Gary Illyes (Search Central Live, July 2025). We did not read the originals. Do not quote them.
- Secondary reports also say Chrome Lighthouse audits for llms.txt. Unverified; irrelevant to Search visibility per Google's own guide.
- OpenAI, Anthropic, Perplexity, Apple, Microsoft: no official crawler page we read says they use llms.txt for search inclusion. Status: **no evidence of adoption; unverified either way.**
- Position for BetterDesk: Presence may report whether an llms.txt exists as information only. It must never score a missing llms.txt as a problem.

---

## Claims we may make / claims we must not make

These rules bind marketing copy, sales scripts, the Presence audit UI, and generated report text.

| # | MAY say (sourced) | MUST NOT say |
|---|---|---|
| 1 | "Google says there are no additional requirements to appear in AI Overviews or AI Mode beyond being indexed and eligible to show a snippet." (src 1) | "BetterDesk gets you into AI Overviews / ChatGPT / Copilot." Any guaranteed placement, citation or recommendation. |
| 2 | "Google describes optimizing for its AI search features as still SEO." (src 2) | "GEO/AEO is a new discipline that replaces SEO" or "a secret AI ranking method." |
| 3 | "Presence checks whether the crawlers that power AI search (for example OAI-SearchBot, Claude-SearchBot, PerplexityBot) are allowed by your robots.txt." (src 11, 14, 15) | "Rank #1 in ChatGPT," "be the cleaner ChatGPT recommends," "get recommended by AI." |
| 4 | "OpenAI says sites that block OAI-SearchBot will not be shown in ChatGPT search answers." (src 11) | "Allowing OAI-SearchBot gets you into ChatGPT answers." (Allowing is necessary, not sufficient.) |
| 5 | "Blocking GPTBot, ClaudeBot, Google-Extended or Applebot-Extended is a training choice; the providers say it is separate from search." (src 5, 11, 14, 16) | "Blocking AI training bots hides you from AI search" or "you must allow training to be found." |
| 6 | "Google ignores llms.txt for Search; we report it as information only." (src 2) | "You need an llms.txt to appear in AI search." Scoring a missing llms.txt as a failure. |
| 7 | "Structured data must match what the page visibly says; Google says it is not required for AI features but helps rich-result eligibility." (src 2, 6) | "Schema markup makes AI choose you." Recommending markup for content not on the page, or self-review star markup for stars. (src 8) |
| 8 | "Google Search Console reports how often your pages appeared in Google's generative AI features; Bing Webmaster Tools reports citations in Copilot and Bing AI summaries." (src 3, 13) | Any invented "AI visibility score" presented as a measurement of how often AI recommends you. Any number about ChatGPT/Gemini/Claude answer share we did not measure from a first-party tool. |
| 9 | "AI search is an emerging way people find local services. Nobody outside these companies can see exactly how sources are chosen." | Fabricated statistics ("60% of buyers now use ChatGPT to find cleaners") unless sourced and dated. |
| 10 | "For a service-area business, Google's profile guidelines say to hide your address if customers don't visit you and keep a realistic service area." (src 9) | Advising keyword-stuffed business names, fake addresses, or virtual offices to rank in more cities. |
| 11 | "Presence results are a point-in-time check of your public website." | "Presence monitors what ChatGPT says about you" (it does not, unless we build and disclose a real measured method). |
| 12 | "You can see ChatGPT referral visits in analytics via `utm_source=chatgpt.com`." (src 12, re-verify) | "We track every AI mention of your company." |

Wording rule for the Presence UI: findings describe access and clarity ("OAI-SearchBot is blocked by robots.txt line 7"), never outcomes ("you are invisible to ChatGPT"). Use "eligible," "can be read by," "blocked from"; avoid "ranked," "recommended," "guaranteed."

---

## Crawler table

| User agent (robots.txt token) | Operator | Purpose | Effect of blocking (per operator) | Source |
|---|---|---|---|---|
| Googlebot | Google | Crawls for Google Search index (and Images, News, Discover) | Pages not crawled for Search; also removes eligibility for AI Overviews/AI Mode, which require indexing with a snippet | https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers ; https://developers.google.com/search/docs/appearance/ai-features |
| Google-Extended (control token only, no separate UA string) | Google | Controls use for Gemini model training and grounding in Gemini Apps / Vertex AI | "does not impact a site's inclusion in Google Search nor is it used as a ranking signal" | https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers |
| (Search Console setting, not robots.txt) Search generative AI control | Google | Inclusion in AI Overviews, AI Mode, Discover gen-AI features | Site's links and content excluded from those features; not a ranking signal elsewhere | https://support.google.com/webmasters/answer/16908024 |
| Bingbot | Microsoft | Crawls for Bing index (which Bing's AI features draw on) | Not crawled for Bing. Effect on Copilot citations not separately documented in sources we could read | https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a (not read in full) |
| OAI-SearchBot | OpenAI | Surfaces sites in ChatGPT search features | "will not be shown in ChatGPT search answers" (may still appear as navigational links); ~24h to take effect | https://developers.openai.com/api/docs/bots |
| GPTBot | OpenAI | Collects content for training foundation models | Content "should not be used in training"; separate from search | https://developers.openai.com/api/docs/bots |
| ChatGPT-User | OpenAI | Fetches a page when a user's request needs it; not automatic crawling | "robots.txt rules may not apply"; not used to decide search inclusion | https://developers.openai.com/api/docs/bots |
| OAI-AdsBot | OpenAI | Checks pages submitted as ChatGPT ads | Only visits ad landing pages; irrelevant unless you advertise | https://developers.openai.com/api/docs/bots |
| ClaudeBot | Anthropic | Collects content that may contribute to model training | Future content excluded from training datasets | https://support.claude.com/en/articles/8896518 |
| Claude-SearchBot | Anthropic | Indexes content to improve search results | "may reduce your site's visibility and accuracy in user search results" | https://support.claude.com/en/articles/8896518 |
| Claude-User | Anthropic | Fetches pages when a Claude user asks | "may reduce your site's visibility for user-directed web search" | https://support.claude.com/en/articles/8896518 |
| PerplexityBot | Perplexity | Surfaces and links sites in Perplexity search results; not used for foundation-model training | Perplexity recommends allowing it "to ensure your site appears in search results" | https://docs.perplexity.ai/guides/bots |
| Perplexity-User | Perplexity | User-triggered fetches | "generally ignores robots.txt rules" | https://docs.perplexity.ai/guides/bots |
| Applebot | Apple | Powers search in Spotlight, Siri, Safari | Not crawled for Apple search features | https://support.apple.com/en-us/119829 |
| Applebot-Extended (control token, does not crawl) | Apple | Opt-out of training Apple foundation models | Pages "can still be included in search results" | https://support.apple.com/en-us/119829 |

Presence implication: the audit should flag a robots.txt block on Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot or Applebot as a visibility issue, and report blocks on GPTBot, ClaudeBot, Google-Extended, Applebot-Extended as a neutral owner choice. User-triggered fetchers (ChatGPT-User, Claude-User, Perplexity-User) should be reported but not scored, since operators say robots.txt may not apply to them (Anthropic says its bots honor it).

## Could not verify

- OpenAI Publishers FAQ: blocked to our fetcher (403). Quotes taken from search-engine index of the official page.
- Bing help pages (AI Performance, New AI Preferences, Webmaster Guidelines): client-rendered; not readable. AI Performance verified via the official Bing blog instead. New AI Training / AI Grounding preferences unverified.
- No "last updated" date was visible on Google's AI optimization guide or common crawlers page.
- Direct quotes from John Mueller / Gary Illyes on llms.txt: secondary reports only.
- Whether any AI provider uses llms.txt: no official statement found either way, other than Google Search ignoring it.
