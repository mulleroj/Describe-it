import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { Icon } from '../components/ui/Icon.tsx'

export function AppLayout() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = `${pathname === '/' ? 'Practical English' : pathname === '/random' ? 'Random challenge' : pathname.startsWith('/topics') ? 'Topics' : 'Page not found'} · Describe It!`
    if (previousPath.current !== pathname) {
      main.current?.focus()
      window.scrollTo(0, 0)
      previousPath.current = pathname
    }
  }, [pathname])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header container">
        <Link to="/" className="brand" aria-label="Describe It! — Home"><span className="brand__mark"><Icon name="speech" /></span><span>Describe It<span className="brand__accent">!</span></span></Link>
        <span className="header-note">English, in your own words.</span>
      </header>
      <main className="container" id="main-content" ref={main} tabIndex={-1}><Outlet /></main>
      <footer className="site-footer container"><span>Describe It! <span className="footer-divider">/</span> Practical English</span><span>One description at a time.</span></footer>
    </div>
  )
}
