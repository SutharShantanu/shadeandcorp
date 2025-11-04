import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Package,
  Globe,
  Truck,
  CreditCard,
  Headphones,
  Repeat,
} from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "What is your return policy?",
      a: "We offer a comprehensive 30-day return policy for all unused items in their original packaging. If you're not completely satisfied with your purchase, simply return it to us within 30 days for a full refund or exchange. Please note that return shipping costs may apply unless the item is defective.",
      icon: Package,
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, we ship to most countries worldwide. International shipping rates vary by destination and package weight. During checkout, you'll see the exact shipping cost before finalizing your order. Please note that import duties and taxes may apply based on your country's regulations.",
      icon: Globe,
    },
    {
      q: "How can I track my order?",
      a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can click the tracking link in the email or enter the tracking number on our website to monitor your package's journey. We use reliable shipping partners to ensure real-time tracking updates.",
      icon: Truck,
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various digital payment methods. All transactions are secured using industry-standard encryption to protect your personal information.",
      icon: CreditCard,
    },
    {
      q: "How do I contact customer service?",
      a: "Our customer service team is available 24/7 through multiple channels: Live chat on our website, email support@example.com, or call us at 1-800-EXAMPLE. We typically respond to inquiries within 24 hours.",
      icon: Headphones,
    },
    {
      q: "Do you offer size exchanges?",
      a: "Yes, we offer free size exchanges for all clothing items. If you need a different size, simply initiate an exchange through your account or contact customer service. We'll send you the new size as soon as we receive the original item.",
      icon: Repeat,
    },
  ];

  return (
    <div className="mx-auto px-6 py-12 w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Got questions? We&apos;ve got answers. If you can&apos;t find what
          you&apos;re looking for, feel free to contact our support team.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map(({ q, a, icon: Icon }, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-lg transition-all w-full min-w-full overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 w-full text-left hover:no-underline data-[state=open]:rounded-b-none">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center justify-center w-8 h-8">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold flex-1 text-left">
                  {q}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 w-full text-muted-foreground bg-gray-100 shadow-inner">
              <div className="pl-12">
                <p className="leading-relaxed">{a}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-muted-foreground mb-4">
          Still have questions?
        </p>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}