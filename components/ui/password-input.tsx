'use client'

import React, { useId, useState, forwardRef } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            placeholder='Your Password'
            type={isVisible ? 'text' : 'password'}
            className={cn('pr-9', className)}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
            tabIndex={-1}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isVisible ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
