import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/lib/Predicate'

type SearchType = 'Book' | 'Chapter' | 'Verse' | 'None'

type BibleSearch = {
  book: O.Option<string>
  chapter: O.Option<number>
  verse: O.Option<number>
}

const bookPredicate: Predicate<BibleSearch> = (bible: BibleSearch) =>
  O.isSome(bible.book) && O.isNone(bible.chapter)

const chapterPredicate: Predicate<BibleSearch> = (bible: BibleSearch) =>
  O.isSome(bible.book) && O.isSome(bible.chapter) && O.isNone(bible.verse)

const versePredicate: Predicate<BibleSearch> = (bible: BibleSearch) =>
  O.isSome(bible.book) && O.isSome(bible.chapter) && O.isSome(bible.verse)

function getFromPredicate(
  search: BibleSearch,
  predicate: Predicate<BibleSearch>,
  typeString: SearchType
): O.Option<SearchType> {
  return pipe(
    search,
    O.fromPredicate(predicate),
    O.map((_) => typeString)
  )
}

function getBook(search: BibleSearch): O.Option<SearchType> {
  return getFromPredicate(search, bookPredicate, 'Book')
}

function getChapter(search: BibleSearch): O.Option<SearchType> {
  return getFromPredicate(search, chapterPredicate, 'Chapter')
}

function getVerse(search: BibleSearch): O.Option<SearchType> {
  return getFromPredicate(search, versePredicate, 'Verse')
}

function getSearchType(search: BibleSearch): string {
  return pipe(
    getBook(search),
    O.orElse(() => getChapter(search)),
    O.orElse(() => getVerse(search)),
    O.getOrElse(() => 'None')
  )
}

// ? Tests

// Should return "Book"
const bookSearch: BibleSearch = { book: O.some('Job'), chapter: O.none, verse: O.none }
getSearchType(bookSearch) // ?

// Should return "Chapter"
const chapterSearch: BibleSearch = { book: O.some('Job'), chapter: O.some(1), verse: O.none }
getSearchType(chapterSearch) // ?

// Should return "Verse"
const verseSearch: BibleSearch = { book: O.some('Job'), chapter: O.some(1), verse: O.some(3) }
getSearchType(verseSearch) // ?

// Should return "None"
const noneSearch: BibleSearch = { book: O.none, chapter: O.none, verse: O.none }
getSearchType(noneSearch) // ?
//
