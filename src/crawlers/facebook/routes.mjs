import { createPlaywrightRouter, Dataset } from 'crawlee'

// createPlaywrightRouter() is only a helper to get better
// intellisense and typings. You can use Router.create() too.
export const router = createPlaywrightRouter()

// This replaces the request.label === DETAIL branch of the if clause.
router.addHandler('DETAIL', async ({ request, page, log }) => {
	log.debug(`Extracting data: ${request.url}`)
	/*
	const urlParts = request.url.split('/').slice(-2)
	const modifiedTimestamp = await page.locator('time[datetime]').getAttribute('datetime')
	const runsRow = page.locator('ul.ActorHeader-userMedallion > li').filter({ hasText: 'Runs' })
	const runCountString = await runsRow.textContent()

	const results = {
		url: request.url,
		uniqueIdentifier: urlParts.join('/'),
		owner: urlParts[0],
		title: await page.locator('.ActorHeader-identificator h1').textContent(),
		description: await page.locator('p.ActorHeader-description').textContent(),
		modifiedDate: new Date(Number(modifiedTimestamp)),
		runCount: runCountString.replace('R	uns ', ''),
	}*/
	const urlParts = request.url.split('/').slice(-2)
	const modifiedTimestamp = await page.locator('time[datetime]').getAttribute('datetime')
	
	const results = {
		url: request.url,
		uniqueIdentifier: urlParts.join('/'),
		title: await page.locator('h1').textContent(),
		modifiedDate: new Date(Number(modifiedTimestamp)),
		dest: 'DETAIL'
	}

	log.debug(`Saving data: ${request.url}`)
	await Dataset.pushData(results)
})

// This is a fallback route which will handle the start URL
// as well as the LIST labeled URLs.
router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
	log.debug(`Enqueueing pagination: ${request.url}`)
	const infos = await enqueueLinks({
		selector: 'a',
		label: 'DETAIL',
		strategy: 'same-domain',
		regexps: [/.*pra.*/]
	})

	if (infos.processedRequests.length === 0) {
		log.info(`${request.url} is the last page!`)
	}
})
/*
// This function is called if the page processing failed more than maxRequestRetries+1 times.
router.failedRequestHandler({ request, log }) {
	log.info(`Request ${request.url} failed too many times.`)
}
*/