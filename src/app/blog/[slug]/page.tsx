import CommentBox from "@/app/components/comment";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "next-sanity";
import Image from "next/image";

type PageProps = {
  params: {
    slug: string;
  };
};

interface BlogData {
  Title: string;
  Paragraph: string;
  image: any; // Adjust type based on your Sanity schema
  block: any; // Adjust type if needed
}

export default async function page({ params: { slug } }: PageProps) {
  const query = `*[_type == 'blog' && slug.current == $slug]{
    Title, Paragraph, image, block
  }[0]`;

  const data: BlogData | null = await client.fetch(query, { slug });

  if (!data) {
    return <p>Blog post not found.</p>;
  }

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8">
      <h1 className="text-xl xs:text-3xl lg:text-5xl font-bold text-dark dark:text-light">
        {data.Title}
      </h1>

      <Image
        src={data.image ? urlFor(data.image).url() : "/placeholder.png"}
        width={500}
        height={500}
        alt="Blog Featured Image"
        className="rounded"
      />

      <section>
        <h2 className="text-xl xs:text-2xl md:text-3xl font-bold uppercase text-accentDarkPrimary">
          Summary
        </h2>
        <p className="text-base md:text-xl leading-relaxed text-justify text-dark/80 dark:text-light/80">
          {data.Paragraph}
        </p>
      </section>

      <section className="px-2 sm:px-8 md:px-12 flex gap-2 xs:gap-4 sm:gap-6 items-start xs:items-center justify-start">
        <Image
          src={"/car.png"}
          width={200}
          height={200}
          alt="Author Image"
          className="object-cover rounded-full h-12 w-12 sm:h-24 sm:w-24"
        />
      </section>

      <section className="text-lg leading-normal text-dark/80 dark:text-light/80">
        {data.block ? <PortableText value={data.block} /> : <p>No content available.</p>}
        <CommentBox />
      </section>
    </article>
  );
}