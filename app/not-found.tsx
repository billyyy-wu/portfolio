import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-site px-4 py-24">
      <h1 className="text-4xl font-black text-ink">Article not found</h1>
      <p className="mt-4 text-lg leading-8 text-neutral-600">
        The article may have been moved or removed.
      </p>
      <Link className="mt-8 inline-block font-black text-accent" href="/">
        Back to work
      </Link>
    </section>
  );
}
