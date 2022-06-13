import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

const posts = [
  {slug: 'my-new-post', title: 'My new Post', excerpt: 'Post excerpt', updatedAt: '09 de maio'}
]

jest.mock('../../services/prismic')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My new Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new Post'}
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt'}
              ],
            },
            last_publication_date: '09-05-2022'
          }
        ]
      })
    })

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: { 
            slug: 'my-new-post',
            title: 'My new Post',
            excerpt: 'Post excerpt', 
            updatedAt: '05 de setembro de 2022'
          }
        }
      })
    )

  })
})