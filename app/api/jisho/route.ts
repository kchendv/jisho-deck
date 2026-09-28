import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  try {
    const url = `https://jisho.org/search/${encodeURIComponent(word)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const firstResult = $('.concept_light').first();

    if (firstResult.length === 0) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }

    const kanji = firstResult.find('.concept_light-representation .text').first().text().trim();
    const furigana = firstResult.find('.concept_light-representation .furigana').first().text().trim();
    
    const meanings = firstResult.find('.meanings-wrapper .meaning-meaning').map((_, el) => {
      return $(el).text().trim();
    }).get();

    const tags = firstResult.find('.concept_light-tag').map((_, el) => {
      return $(el).text().trim();
    }).get();

    const jlptLevel = tags.find(tag => tag.includes('JLPT')) || '';
    
    let hiragana = '';
    let katakana = '';
    
    if (furigana) {
      if (/[\u3040-\u309F]/.test(furigana)) {
        hiragana = furigana;
      } else if (/[\u30A0-\u30FF]/.test(furigana)) {
        katakana = furigana;
      } else {
        hiragana = furigana;
      }
    }

    return NextResponse.json({
      kanji: kanji || word,
      hiragana: hiragana,
      katakana: katakana,
      definition: meanings.join('; ') || '',
      pronunciation: furigana || '',
      level: jlptLevel,
      jishoUrl: url
    });

  } catch (error) {
    console.error('Error scraping Jisho:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Jisho.org' },
      { status: 500 }
    );
  }
}
