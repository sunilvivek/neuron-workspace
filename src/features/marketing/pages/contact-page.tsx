import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "../components/badge"
import { Mail, MessageSquare, MapPin, Send } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@neuronworkspace.com" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA" },
  { icon: MessageSquare, label: "Response time", value: "Within 24 hours" },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmit(_data: ContactFormValues) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSubmitted(true)
        reset()
        resolve()
      }, 1000)
    })
  }

  return (
    <>
      <section className="py-20 sm:py-28" aria-labelledby="contact-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">Contact</Badge>
            <h1 id="contact-hero" className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Have a question, suggestion, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20" aria-label="Contact form and info">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-6 sm:p-8">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Send className="h-8 w-8 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold">Message sent!</h3>
                      <p className="mt-2 text-muted-foreground">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => setSubmitted(false)}
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            {...register("name")}
                            aria-invalid={!!errors.name}
                          />
                          {errors.name && (
                            <p className="text-xs text-destructive">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register("email")}
                            aria-invalid={!!errors.email}
                          />
                          {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          {...register("subject")}
                          aria-invalid={!!errors.subject}
                        />
                        {errors.subject && (
                          <p className="text-xs text-destructive">{errors.subject.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more..."
                          className="min-h-[120px]"
                          {...register("message")}
                          aria-invalid={!!errors.message}
                        />
                        {errors.message && (
                          <p className="text-xs text-destructive">{errors.message.message}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact info sidebar */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {contactInfo.map((item) => (
                <Card key={item.label} className="border-0 bg-muted/50">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-0 bg-muted/50">
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold">Office hours</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Monday — Friday<br />
                    9:00 AM — 6:00 PM PST
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
