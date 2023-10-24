import { PlaywrightCrawler, log } from 'crawlee'
import puppeteerExtra from 'puppeteer-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import { router } from './routes.mjs'

// This is better set with CRAWLEE_LOG_LEVEL env var
// or a configuration option. This is just for show 😈
log.setLevel(log.LEVELS.DEBUG)

log.debug('Setting up crawler.')

// First, we tell puppeteer-extra to use the plugin (or plugins) we want.
// Certain plugins might have options you can pass in - read up on their documentation!
puppeteerExtra.use(stealthPlugin())

// Create an instance of the PlaywrightCrawler class - a crawler
// that automatically loads the URLs in headless Chrome / Playwright.
const crawler = new PlaywrightCrawler({
	launchContext: {
		// !!! You need to specify this option to tell Crawlee to use puppeteer-extra as the launcher !!!
		launcher: puppeteerExtra,
		// Here you can set options that are passed to the playwright .launch() function.
		launchOptions: {
			headless: true
		}
	},
	requestHandler: router,

	// Stop crawling after several pages
	maxRequestsPerCrawl: 10
})
/*
await crawler.addRequests([
	'https://www.facebook.com/groups/532665789006153/events',
])
*/
await crawler.addRequests([
	'https://ceskytunak.cz'
])

// Run the crawler and wait for it to finish.
await crawler.run()

console.log('Crawler finished.')