"use client"

import Link from "next/link"
import Image from "next/image"
import { ThemeToggle as Theme } from "@/components/ui/theme-toggle"
import { useEffect, useState, type ReactNode } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Field, FieldError } from "@/components/ui/field"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { CalendarDays, Heart, ArrowUpRightIcon, MailIcon, ArrowRightIcon } from "lucide-react"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  honeypot: z.string().max(0, "Bot detected").optional(),
});
type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export type FooterProps = {
  logo?: {
    href?: string
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
  }
  description: ReactNode
  navigation: {
    categories: {
      id: string
      name: string
      sections: {
        id: string
        name: string
        items: {
          name: string
          href: string
        }[]
      }[]
    }[]
  }
  socials: {
    name: string
    href: string
    icon: string
  }[]
  copyright: {
    creator: {
      name: string
      href: string
    }
    company: {
      name: string
      href: string
    }
  }
}

function SocialLink({ href, icon, name }: { href: string; icon: string; name: string }) {
  const src = icon.startsWith("http") || icon.startsWith("/") ? icon : `https://thesvg.org/icons/${icon}`
  
  return (
    <Link
      aria-label={name}
      href={href}
      rel="noreferrer"
      target="_blank"
      className="text-muted-foreground hover:text-primary transition-colors p-2 bg-muted/50 rounded-full hover:bg-muted"
    >
      <Image src={src} alt={name} width={20} height={20} className="h-5 w-5" />
    </Link>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link-button inline-flex items-center text-sm text-muted-foreground hover:text-foreground motion-safe:transition-colors"
    >
      {children}
      <ArrowUpRightIcon aria-hidden="true" className="ml-1 h-3 w-3 motion-safe:transition-transform group-hover/link-button:rotate-45" />
    </Link>
  )
}

function GithubHoverCardContent({ username }: { username: string }) {
  const [data, setData] = useState<{ bio?: string; joined?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (res.ok) {
          const user = await res.json();
          const date = new Date(user.created_at);
          const joined = `Joined ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
          setData({ bio: user.bio, joined, name: user.name || username });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  return (
    <HoverCardContent className="w-80 border-border bg-background shadow-lg ml-4 mb-2">
      <div className="flex justify-between space-x-4">
        <Avatar>
          <AvatarImage src={`https://github.com/${username}.png`} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@{data?.name || username}</h4>
          {loading ? (
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-muted motion-safe:animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-muted motion-safe:animate-pulse rounded" />
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {data?.bio || "Open Source Enthusiast. Building modern web experiences."}
              </p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {data?.joined || "Joined GitHub"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </HoverCardContent>
  );
}

export function Footer({
  logo,
  description,
  navigation,
  socials,
  copyright,
}: FooterProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema)
  });

  const onNewsletterSubmit = (data: NewsletterFormValues) => {
    if (data.honeypot) return;
    console.log("Newsletter subscription:", data.email);
    reset();
  };

  return (
    <footer className="w-full bg-background border-t border-border mt-20">
      <div className="mx-auto max-w-7xl py-12 md:py-16">
        <div className="xl:grid xl:grid-cols-6 xl:gap-8">
          
          {/* Brand & Description (Takes 1 or 2 columns based on screen size, less width overall) */}
          <div className="flex flex-col items-start space-y-6 xl:col-span-2">          
            {logo && (
              <Link href={logo.href || "/"} className="inline-block">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 120}
                  height={logo.height || 40}
                  className={`object-left object-contain ${logo.className || "h-10 w-auto"}`}
                />
              </Link>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            
            {/* App Store Badges */}
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
                Experience App on Mobile
              </h3>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_ENs.svg" 
                    alt="Get it on Google Play" 
                    width={135} 
                    height={40} 
                    className="h-10 w-auto" 
                  />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                    alt="Download on the App Store" 
                    width={135} 
                    height={40} 
                    className="h-10 w-auto" 
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Socials, Newsletter & Navigation Links */}
          <div className="mt-16 xl:col-span-4 xl:mt-0 space-y-12">
            {/* Top row: Socials & Newsletter */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-border pb-12">
              {/* Socials */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-5">
                  Connect With Us
                </h3>
                <div className="flex items-center gap-3">
                  {socials.map((social) => (
                    <SocialLink key={social.name} {...social} />
                  ))}
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="flex-1 max-w-sm w-full">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-3">
                  Subscribe to our newsletter
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest updates, deals, and exclusive offers straight to your inbox.
                </p>
                <form className="max-w-sm" onSubmit={handleSubmit(onNewsletterSubmit)}>
                  <input
                    type="text"
                    {...register("honeypot")}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <Field>
                    <InputGroup>
                      <InputGroupAddon>
                        <MailIcon className="text-muted-foreground size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                      />
                      <InputGroupButton type="submit" variant="default" size="icon-sm">
                        <ArrowRightIcon />
                      </InputGroupButton>
                    </InputGroup>
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>
                </form>
              </div>
            </div>

            {/* Navigation Links */}
            <nav aria-label="Footer Navigation" className="grid grid-cols-2 gap-8">
            {navigation.categories.map((category) => (
              <div key={category.id} className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {category.sections.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
                      {section.name}
                    </h3>
                    <ul role="list" className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item.name}>
                          <FooterLink href={item.href}>{item.name}</FooterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright & Theme Toggle */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-y-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} {copyright.company.name}. Made with</span>
            <Heart className="mx-1.5 h-4 w-4 text-destructive fill-destructive motion-safe:animate-pulse" />
            <span>by</span>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  href={copyright.creator.href}
                  target="_blank"
                  className="ml-1 font-medium text-foreground hover:text-primary motion-safe:transition-colors underline decoration-dotted underline-offset-4"
                >
                  {copyright.creator.name}
                </Link>
              </HoverCardTrigger>
              <GithubHoverCardContent username={copyright.creator.name} />
            </HoverCard>
          </div>
          
          <div className="flex items-center gap-4">
            <Theme />
          </div>
        </div>
      </div>
    </footer>
  )
}
