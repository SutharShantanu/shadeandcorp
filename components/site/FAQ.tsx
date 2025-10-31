import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "What is your return policy?",
      a: "We offer a comprehensive 30-day return policy for all unused items in their original packaging. If you're not completely satisfied with your purchase, simply return it to us within 30 days for a full refund or exchange. Please note that return shipping costs may apply unless the item is defective.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, we ship to most countries worldwide. International shipping rates vary by destination and package weight. During checkout, you'll see the exact shipping cost before finalizing your order. Please note that import duties and taxes may apply based on your country's regulations.",
    },
    {
      q: "How can I track my order?",
      a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can click the tracking link in the email or enter the tracking number on our website to monitor your package's journey. We use reliable shipping partners to ensure real-time tracking updates.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various digital payment methods. All transactions are secured using industry-standard encryption to protect your personal information.",
    },
    {
      q: "How do I contact customer service?",
      a: "Our customer service team is available 24/7 through multiple channels: Live chat on our website, email support@example.com, or call us at 1-800-EXAMPLE. We typically respond to inquiries within 24 hours.",
    },
    {
      q: "Do you offer size exchanges?",
      a: "Yes, we offer free size exchanges for all clothing items. If you need a different size, simply initiate an exchange through your account or contact customer service. We'll send you the new size as soon as we receive the original item.",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Got questions? We've got answers. If you can't find what you're looking
          for, feel free to contact our support team.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
