import { useLayoutEffect } from 'react'

function sectionIdFromHash(hash: string) {
  if (!hash.startsWith('#') || hash.length < 2) return null
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return null
  }
}

function scrollOffset() {
  const navigation = document.querySelector<HTMLElement>('[data-site-navigation]')
  return (navigation?.getBoundingClientRect().bottom ?? 80) + 20
}

export async function navigateToSection(
  sectionId: string,
  options: { updateHistory?: boolean; focusTarget?: boolean; immediate?: boolean } = {},
) {
  const destination = document.getElementById(sectionId)
  if (!destination) return

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

  const top = destination.getBoundingClientRect().top + window.scrollY - scrollOffset()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({
    top: Math.max(0, top),
    behavior: options.immediate || reducedMotion ? 'auto' : 'smooth',
  })

  if (options.updateHistory !== false && window.location.hash !== `#${sectionId}`) {
    window.history.pushState(null, '', `#${sectionId}`)
  }

  if (options.focusTarget) {
    destination.setAttribute('tabindex', '-1')
    destination.focus({ preventScroll: true })
    destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true })
  }
}

async function waitForStableLayout() {
  await document.fonts?.ready
  const images = Array.from(document.images)
  await Promise.all(images.map(async (image) => {
    if (image.complete) return
    await new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })
  }))
}

export function useInPageNavigation() {
  useLayoutEffect(() => {
    let cancelled = false
    let historyFrame = 0
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return

      const sectionId = sectionIdFromHash(anchor.hash)
      if (!sectionId || !document.getElementById(sectionId)) return

      event.preventDefault()
      void navigateToSection(sectionId, { focusTarget: event.detail === 0 })
    }

    const onHistoryNavigation = () => {
      cancelAnimationFrame(historyFrame)
      historyFrame = requestAnimationFrame(() => {
        const sectionId = sectionIdFromHash(window.location.hash)
        if (sectionId) void navigateToSection(sectionId, { updateHistory: false })
        else window.scrollTo({ top: 0, behavior: 'auto' })
      })
    }

    document.addEventListener('click', onDocumentClick)
    window.addEventListener('popstate', onHistoryNavigation)
    window.addEventListener('hashchange', onHistoryNavigation)

    const initialSection = sectionIdFromHash(window.location.hash)
    if (initialSection) {
      window.scrollTo(0, 0)
      void waitForStableLayout().then(() => {
        if (!cancelled) {
          void navigateToSection(initialSection, {
            updateHistory: false,
            immediate: true,
          })
        }
      })
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(historyFrame)
      document.removeEventListener('click', onDocumentClick)
      window.removeEventListener('popstate', onHistoryNavigation)
      window.removeEventListener('hashchange', onHistoryNavigation)
      window.history.scrollRestoration = previousRestoration
    }
  }, [])
}
