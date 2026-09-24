// Hosts next/image is allowed to optimize. Photos from anywhere else are shown unoptimized.
export const IMAGE_HOSTS = ['img.clerk.com', 'utfs.io', '*.ufs.sh', 'randomuser.me', 'api.dicebear.com']

export function isOptimizableImage(src: string) {
  if (src.startsWith('/')) return true
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' || /\/svg$|\.svg$/.test(url.pathname)) return false
  return IMAGE_HOSTS.some((host) =>
    host.startsWith('*.') ? url.hostname.endsWith(host.slice(1)) : url.hostname === host
  )
}
