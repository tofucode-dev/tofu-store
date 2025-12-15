#!/usr/bin/env node

import { algoliasearch } from 'algoliasearch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env') })

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || process.env.ALGOLIA_SEARCH_API_KEY
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'instant_search'

if (!APP_ID || !SEARCH_API_KEY) {
  console.error('❌ Missing Algolia credentials')
  process.exit(1)
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
}

async function generateCategorySlugs() {
  console.log('🔍 Fetching category facets from Algolia...')
  
  const client = algoliasearch(APP_ID!, SEARCH_API_KEY!)

  const response = await client.searchSingleIndex({
    indexName: INDEX_NAME,
    searchParams: {
      query: '',
      hitsPerPage: 0,
      facets: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
      maxValuesPerFacet: 1000,
    },
  })

  const slugToValue: Record<string, string> = {}
  const valueToSlug: Record<string, string> = {}

  ;['lvl0', 'lvl1', 'lvl2'].forEach(level => {
    const facets = response.facets?.[`hierarchicalCategories.${level}`] || {}
    
    Object.keys(facets).forEach(categoryValue => {
      const originalSegments = categoryValue.split(' > ')
      const slugSegments = originalSegments.map(slugify)
      const slugPath = slugSegments.join('/')

      slugToValue[slugPath] = categoryValue
      valueToSlug[categoryValue] = slugPath

      originalSegments.forEach((segment, i) => {
        const segmentSlug = slugSegments[i]
        if (!slugToValue[segmentSlug]) slugToValue[segmentSlug] = segment
        if (!valueToSlug[segment]) valueToSlug[segment] = segmentSlug
      })
    })
  })

  const dataDir = path.join(rootDir, 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  const outputPath = path.join(dataDir, 'category-slugs.json')
  fs.writeFileSync(outputPath, JSON.stringify({ slugToValue, valueToSlug }, null, 2))

  console.log(`✅ Generated ${Object.keys(slugToValue).length} mappings → data/category-slugs.json`)
}

generateCategorySlugs().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})

