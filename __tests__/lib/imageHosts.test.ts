import { isOptimizableImage } from '@/lib/imageHosts'

describe('isOptimizableImage', () => {
  it.each([
    'https://img.clerk.com/abc',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://abc123.ufs.sh/f/photo.png',
    '/photos/Hero.jpeg',
  ])('optimizes %s', (src) => {
    expect(isOptimizableImage(src)).toBe(true)
  })

  it.each([
    'https://example.com/photo.jpg',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    'blob:http://localhost:3000/1234',
    'http://img.clerk.com/abc',
    'not a url',
  ])('skips %s', (src) => {
    expect(isOptimizableImage(src)).toBe(false)
  })
})
