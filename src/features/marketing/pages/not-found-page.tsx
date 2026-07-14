import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4" aria-labelledby="notfound-heading">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-7xl font-bold tracking-tighter sm:text-9xl">404</p>
        <h1
          id="notfound-heading"
          className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It may have been moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
