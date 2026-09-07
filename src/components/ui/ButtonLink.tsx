import { Link, type LinkProps } from 'react-router'

export function ButtonLink({ variant = 'primary', className = '', ...props }: LinkProps & { variant?: 'primary' | 'secondary' }) {
  return <Link {...props} className={`button button--${variant} ${className}`} />
}
