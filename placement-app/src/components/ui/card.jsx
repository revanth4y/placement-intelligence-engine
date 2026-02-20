export function Card({ className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight text-slate-900 ${className}`} {...props} />
  )
}

export function CardDescription({ className = '', ...props }) {
  return <p className={`text-sm text-slate-500 ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}

export function CardFooter({ className = '', ...props }) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
}
