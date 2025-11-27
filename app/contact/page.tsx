"use client";

import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Phone, UserRound, SendHorizontal, CheckCircle2, Info, MessageSquare, Package, RefreshCcw, Handshake, Clock } from "lucide-react";

const ContactSchema = z.object({
    name: z.string().min(2, "Please enter your full name").max(100),
    email: z.string().email("Enter a valid email").max(200),
    topic: z.enum(["Support", "Order", "Returns", "Billing", "Partnerships", "Other"]),
    subject: z.string().min(3, "Subject is too short").max(150),
    message: z.string().min(10, "Message should be at least 10 characters").max(2000),
    phone: z
        .string()
        .max(20)
        .default("")
        .transform((v) => v.trim())
        .refine((v) => v === "" || /^[+()\-\d\s]{7,20}$/.test(v), {
            message: "Enter a valid phone number",
        }),
});

type ContactFormInput = z.input<typeof ContactSchema>;
type ContactFormValues = z.output<typeof ContactSchema>;

export default function ContactPage() {
    const form = useForm<ContactFormInput, any, ContactFormValues>({
        resolver: zodResolver(ContactSchema),
        defaultValues: { name: "", email: "", topic: "Support", subject: "", message: "", phone: "" } as ContactFormInput,
        mode: "onTouched",
    });

    const [serverStatus, setServerStatus] = useState<
        | { type: "success"; message: string }
        | { type: "error"; message: string }
        | null
    >(null);

    // Prevent irrelevant repeated API calls: dedupe identical payload for 30s and ignore while in-flight
    const lastHashRef = useRef<string | null>(null);
    const inflightRef = useRef<string | null>(null);

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: ContactFormValues) => {
        setServerStatus(null);

        const payloadStr = JSON.stringify(values);
        const hash = await digest(payloadStr);

        if (inflightRef.current === hash) {
            toast.info("Already sending your message…");
            return;
        }
        if (lastHashRef.current === hash) {
            toast.info("Duplicate message ignored (recently submitted)");
            return;
        }

        inflightRef.current = hash;

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payloadStr,
                keepalive: true,
            });

            const data = await res.json();
            if (!res.ok || !data?.ok) {
                throw new Error(data?.error || "Submission failed");
            }

            lastHashRef.current = hash;
            setServerStatus({ type: "success", message: "Thanks! We received your message." });
            toast.success("Message sent");
            form.reset();
        } catch (err: any) {
            setServerStatus({ type: "error", message: err?.message || "Something went wrong" });
            toast.error(err?.message || "Something went wrong");
        } finally {
            inflightRef.current = null;
        }
    };

    const disabled = isSubmitting;

    // Contact info (static)
    const contactInfo = useMemo(
        () => [
            { icon: Mail, label: "Support", value: "support@shadeandcorp.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 013-0149" },
        ],
        []
    );

    const setQuickTopic = (topic: ContactFormValues["topic"], subject?: string) => {
        form.setValue("topic", topic, { shouldValidate: true });
        if (subject) form.setValue("subject", subject, { shouldValidate: true });
        const el = document.getElementById("contact-form");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="py-12 max-w-7xl mx-auto">
            <div className="mx-auto">
                {/* Hero */}
                <div className="rounded-2xl border bg-linear-to-b from-white to-zinc-50 p-6 md:p-8 shadow-sm">
                    <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact our team</h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl">We typically reply within one business day. For order issues, include your order ID for faster help.</p>
                            <div className="mt-4 flex items-center gap-3">
                                <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Response time: under 24h</Badge>
                                <Badge className="bg-emerald-600 text-white">Secure & private</Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                            <QuickHelpCard icon={Package} title="Order help" onClick={() => setQuickTopic("Order", "Order assistance")} />
                            <QuickHelpCard icon={RefreshCcw} title="Returns" onClick={() => setQuickTopic("Returns", "Return / Exchange request")} />
                            <QuickHelpCard icon={Handshake} title="Partnerships" onClick={() => setQuickTopic("Partnerships", "Partnership inquiry")} />
                            <QuickHelpCard icon={MessageSquare} title="General" onClick={() => setQuickTopic("Support", "General support")} />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-5 gap-8 mt-8">
                    <div className="md:col-span-3">
                        <Card id="contact-form">
                            <CardHeader>
                                <CardTitle>Send us a message</CardTitle>
                                <CardDescription>Share as much detail as possible so we can help you quickly.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {serverStatus && (
                                    <Alert
                                        variant={serverStatus.type === "success" ? "default" : "destructive"}
                                        className={`mb-4 ${serverStatus.type === "success"
                                                ? "border-emerald-500/50 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-50"
                                                : ""
                                            }`}
                                    >
                                        {serverStatus.type === "success" ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                <AlertTitle>Success</AlertTitle>
                                                <AlertDescription>{serverStatus.message}</AlertDescription>
                                            </>
                                        ) : (
                                            <>
                                                <Info className="h-4 w-4" />
                                                <AlertTitle>Something went wrong</AlertTitle>
                                                <AlertDescription>{serverStatus.message}</AlertDescription>
                                            </>
                                        )}
                                    </Alert>
                                )}

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Your name</FormLabel>
                                                        <FormControl>
                                                            <InputGroup>
                                                                <InputGroupInput
                                                                    id="name"
                                                                    placeholder="Jane Doe"
                                                                    aria-label="Your Name"
                                                                    autoComplete="name"
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                                <InputGroupAddon>
                                                                    <UserRound className="h-4 w-4" />
                                                                </InputGroupAddon>
                                                            </InputGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <InputGroup>
                                                                <InputGroupInput
                                                                    id="email"
                                                                    type="email"
                                                                    placeholder="you@example.com"
                                                                    aria-label="Email Address"
                                                                    autoComplete="email"
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                                <InputGroupAddon>
                                                                    <Mail className="h-4 w-4" />
                                                                </InputGroupAddon>
                                                            </InputGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone (optional)</FormLabel>
                                                        <FormControl>
                                                            <PhoneInput
                                                                id="phone"
                                                                placeholder="Enter phone number"
                                                                aria-label="Phone Number"
                                                                defaultCountry="IN"
                                                                autoComplete="tel"
                                                                {...field}
                                                                value={field.value || ""}
                                                            />
                                                        </FormControl>
                                                        {/* <FormDescription>We'll only use this to reach you about your request.</FormDescription>
                                                        <FormMessage /> */}
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="topic"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Topic</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Choose a topic" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Support">
                                                                        <div className="flex items-center gap-2">
                                                                            <MessageSquare className="h-4 w-4" />
                                                                            <span>Support</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="Order">
                                                                        <div className="flex items-center gap-2">
                                                                            <Package className="h-4 w-4" />
                                                                            <span>Order</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="Returns">
                                                                        <div className="flex items-center gap-2">
                                                                            <RefreshCcw className="h-4 w-4" />
                                                                            <span>Returns</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <Separator className="my-1" />
                                                                    <SelectItem value="Billing">
                                                                        <div className="flex items-center gap-2">
                                                                            <Info className="h-4 w-4" />
                                                                            <span>Billing</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="Partnerships">
                                                                        <div className="flex items-center gap-2">
                                                                            <Handshake className="h-4 w-4" />
                                                                            <span>Partnerships</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="Other">
                                                                        <div className="flex items-center gap-2">
                                                                            <Mail className="h-4 w-4" />
                                                                            <span>Other</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subject</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="How can we help?" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={6} placeholder="Write your message here..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="pt-2">
                                            <Button type="submit" disabled={disabled}>
                                                {disabled ? (
                                                    <>
                                                        <Spinner />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <SendHorizontal />
                                                        Send message
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Get in touch</CardTitle>
                                <CardDescription>Our team responds within 24 hours on business days.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <ul className="space-y-3">
                                    {contactInfo.map((c) => (
                                        <li key={c.label} className="flex items-center gap-3">
                                            <c.icon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{c.label}</p>
                                                <p className="text-sm text-muted-foreground">{c.value}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <Separator />
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">Business hours</h3>
                                    <p className="text-sm text-muted-foreground">Mon–Fri: 9am–6pm (UTC)</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">Head office</h3>
                                    <p className="text-sm text-muted-foreground">Shade & Co, 123 Market St, San Francisco, CA</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

async function digest(input: string) {
    // Use Web Crypto API available in the browser
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

type QuickHelpCardProps = { icon: any; title: string; onClick: () => void };
function QuickHelpCard({ icon: Icon, title, onClick }: QuickHelpCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-sm hover:shadow transition"
        >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{title}</span>
        </button>
    );
}
