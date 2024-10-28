import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Tree'
import { fromTraversable, Lens, Optional } from 'monocle-ts'

type User = {
  name: string
  login: string
  posts: Post[]
}

type Post = {
  title: string
  tags: string[]
  comments: O.Option<T.Tree<PostComment>>
  attachment: O.Option<Blob>
}

type PostComment = {
  date: Date
  text: string
  authorName: string
  attachment: O.Option<Blob>
}

const exampleData: User[] = [
  {
    name: 'Yuriy',
    login: 'yuriy',
    posts: [
      {
        title: 'First post',
        tags: ['first', 'post'],
        comments: O.some(
          T.make(
            {
              date: new Date(2019, 0, 1, 0, 0, 0, 0),
              text: 'cool post!',
              authorName: 'Vasiliy',
              attachment: O.none
            },
            [
              T.tree.of({
                date: new Date(2019, 0, 2, 0, 0, 0, 0),
                text: 'and even better comment, my dude',
                authorName: 'Egor',
                attachment: O.none
              })
            ]
          )
        ),
        attachment: O.none
      }
    ]
  }
]

const capitalizeWord = (word: string) =>
  word[0]!.toLocaleUpperCase() + word.substr(1).toLocaleLowerCase()

const capitalize = (title: string) => title.split(' ').map(capitalizeWord).join(' ')

// Non-optics example:
/*
const modifiedDataImperative = exampleData.map(
  (user) => ({
    ...user,
    posts: user.posts.map(
      (post) => ({
        ...post,
        ...(post.attachment != null ? { attachment: post.attachment } : {}),
        comments: tree.map(
          post.comments,
          (comment) => ({
            ...comment,
            ...(comment.attachment != null ? { attachment: comment.attachment } : {}),
            text: capitalize(comment.text),
          }),
        ),
      }),
    ),
  }),
);

console.dir({ modifiedDataImperative }, { depth: null });
/**/
// Optics example:

const usersTraversal = fromTraversable(A.Traversable)<User>()
const postsLens = Lens.fromProp<User>()('posts')
const postTraversal = fromTraversable(A.Traversable)<Post>()

const commentsOptional = Optional.fromOptionProp<Post>()('comments')

const commentTraversal = fromTraversable(T.Traversable)<PostComment>()
const textLens = Lens.fromProp<PostComment>()('text')

const usersTextTraversal = usersTraversal
  .composeLens(postsLens)
  .composeTraversal(postTraversal)
  .composeOptional(commentsOptional) // ? Optional
  .composeTraversal(commentTraversal)
  .composeLens(textLens)

/**
 * Optics works with focused element
 */
const modifiedDataOptics = usersTextTraversal.modify(capitalize)(exampleData)

console.dir({ modifiedDataOptics }, { depth: null })

// console.dir({ exampleData }, { depth: null })
// console.dir(postsLens.set(exampleData[0]!.posts)({ login: 'vasiliy', name: 'Vasiliy', posts: [] }), { depth: Infinity })

